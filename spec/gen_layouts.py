"""Generate the five per-workflow scene placement specs for the A-Lab twin.

Each workflow gets its own scene file. Instruments are placed on a reach annulus around the arm that
serves them, ordered along the arc by process order, so that (a) everything is reachable by
construction and (b) the spatial order reads as the process order.

Rows (radius bands from the serving arm's base) follow PLACEMENT_STANDARD.md:
  back  large floor/bench instruments   r = 0.72 m
  mid   bench-top instruments           r = 0.58 m
  front work items and racks            r = 0.46 m
UR5e wrist envelope is 0.85 m with a further 0.27 m tool offset, so the whole band is comfortably
inside reach; FR3 sits on a 0.25 m pedestal and covers the same band.

Footprints are NOT set here: they are measured from the USDs by the asset pipeline. This file fixes
the design decision that was missing - which arm serves what, in which row, at which angle.
"""
import json, math, pathlib

HERE = pathlib.Path(__file__).resolve().parent
EXPORTS = HERE.parent / "exports"

WORKTOP_Z = 1.0027048932793163
BENCH = {"A": [0.99, -1.63, 2.52, 2.83], "B": [-4.41, -3.165, 0.05, -1.635], "C": [0.06, -3.165, 4.52, -1.635]}
ROBOT = {
    "fr3_A":  {"base": [1.75, 0.6, 1.253840156269062], "bench": "A", "type": "franka_fr3", "yaw_deg": 90},
    "ur5e_B": {"base": [-1.385, -1.805, 1.189704988317584], "bench": "B", "type": "ur5e_2f85", "yaw_deg": 90},
    "ur5e_C": {"base": [2.3, -2.4, 1.0288077568110414], "bench": "C", "type": "ur5e_2f85", "yaw_deg": 90},
}
ROW_R = {"back": 0.72, "mid": 0.58, "front": 0.46}
ROW_OF = {
    "box_furnace": "back", "drying_oven": "back", "mixer": "back", "xrd": "back", "liquid_station": "back",
    "balance": "mid", "dosing_station": "mid", "ph_meter": "mid", "shaker_grinder": "mid", "xrd_prep": "mid",
}                       # everything else falls to "front"

# which arm serves which task step of each workflow
SERVED_BY = {
    "wf01_solid_state_calcination": {"box_furnace": "ur5e_B", "crucible_tray": "ur5e_B", "_default": "fr3_A"},
    "wf02_powder_recovery_xrd":     {"_default": "ur5e_C"},
    "wf03_wet_chemical_precursor":  {"_default": "fr3_A"},
    "wf04_flux_growth_pt_crucible": {"box_furnace": "ur5e_B", "crucible_tray": "ur5e_B", "_default": "fr3_A"},
    "wf05_reagent_logistics_safety": {"_default": "ur5e_C"},
}
# the arc each arm may use, as (centre_deg, half_span_deg) in world frame; 0deg = +x, 90deg = +y
ARC = {"fr3_A": (-90.0, 88.0), "ur5e_B": (-90.0, 60.0), "ur5e_C": (150.0, 85.0)}
# furnace bank keeps its v4 placement: it is the one group that already meets the standard
V4_FURNACES = [(-3.75, -2.885), (-2.92, -2.885), (-2.09, -2.885), (-1.26, -2.885)]


def inside(bench, x, y, margin=0.12):
    x0, y0, x1, y1 = BENCH[bench]
    return x0 + margin <= x <= x1 - margin and y0 + margin <= y <= y1 - margin


MIN_GAP_M = 0.11        # closest two placed items may sit, centre to centre


def place(arm, items, taken=None):
    """spread items along the arm's arc, ordered by process order, at their row radius.

    Each row is spread independently, so a crowded front row does not compete with the back row for
    angular slots. A row too long to hold its items at >=130 mm spacing is split into two sub-rings,
    which is what a real bench does when one row runs out of length.
    """
    bx, by, _ = ROBOT[arm]["base"]
    bench = ROBOT[arm]["bench"]
    c, half = ARC[arm]
    span = math.radians(2 * half)
    out = list(taken or [])
    placed_here = []
    # the angle follows the item's rank in the arm's own process order, across all rows, so that
    # sweeping the arc reads as walking the workflow - the row only chooses how far out it sits
    seq = sorted(items, key=lambda it: it["process_index"])
    rank = {id(it): i for i, it in enumerate(seq)}
    total = max(len(seq) - 1, 1)
    for row in ("back", "mid", "front"):
        grp = [it for it in items if it["row"] == row]
        if not grp:
            continue
        r = ROW_R[row]
        rings = [grp]
        if len(grp) > 1 and r * span / (len(grp) - 1) < 0.13:
            rings = [grp[0::2], grp[1::2]]
        for ri, ring in enumerate(rings):
            rr0 = r - 0.10 * ri
            for it in ring:
                frac = rank[id(it)] / total
                base_ang = c - half + 2 * half * frac
                for dth in (0, 6, -6, 12, -12, 20, -20, 30, -30, 42, -42, 56, -56):
                    for rr in (rr0, rr0 - 0.05, rr0 + 0.05):
                        if not (0.44 <= rr <= 0.76):
                            continue
                        a = math.radians(base_ang + dth)
                        x, y = bx + rr * math.cos(a), by + rr * math.sin(a)
                        if not inside(bench, x, y):
                            continue
                        if any(math.dist((x, y), o["pose"][:2]) < MIN_GAP_M for o in out if o.get("pose")):
                            continue
                        rec = dict(it, pose=[round(x, 3), round(y, 3), round(WORKTOP_Z, 4)],
                                   ring_r_m=round(rr, 3), ring_deg=round(base_ang + dth, 1))
                        out.append(rec); placed_here.append(rec)
                        break
                    else:
                        continue
                    break
                else:
                    rec = dict(it, pose=None, unplaced="no free point on the arc stays inside the bench")
                    out.append(rec); placed_here.append(rec)
    placed_here.sort(key=lambda it: it["process_index"])
    return placed_here


def build(wf):
    man = json.loads((EXPORTS / wf / "isaac_manifest.json").read_text())
    served = SERVED_BY[wf]
    groups, order = {}, []
    for idx, p in enumerate(man.get("prims") or []):
        sem = p.get("semantic") or "object"
        arm = served.get(sem, served["_default"])
        row = ROW_OF.get(sem, "front")
        rec = {"name": f"{sem}_{idx}", "asset_key": p.get("asset_key"), "semantic": sem,
               "row": row, "served_by": arm, "process_index": idx}
        groups.setdefault(arm, []).append(rec)
        order.append(rec)
    prims = []
    for arm, items in groups.items():
        fixed, free = [], []
        for it in items:
            if arm == "ur5e_B" and it["semantic"] == "box_furnace":
                for j, (fx, fy) in enumerate(V4_FURNACES):
                    fixed.append(dict(it, name=f"box_furnace_{j+1}", pose=[fx, fy, round(WORKTOP_Z, 4)],
                                      yaw_deg=180, row="back",
                                      note="v4 furnace bank kept: setback 975 mm, pitch 129 mm, the one group already meeting the standard",
                                      rail_stop_q_m=[0.0, -0.83, -1.66, -2.49][3 - j]))
            else:
                free.append(it)
        # pass everything already placed so the spacing rule sees the whole scene, not one arm at a time
        prims += fixed + place(arm, free, taken=prims + fixed)
    robots = {a: ROBOT[a] for a in groups}
    if "ur5e_B" in robots:
        robots["ur5e_B"] = dict(robots["ur5e_B"], rail_prismatic={"axis": "world_x", "q_limits_m": [-2.59, 0.10],
                                                                  "travel_m": 2.69, "park_q_m": 0.0})
    unplaced = [p["name"] for p in prims if not p.get("pose")]
    return {"scene_id": wf, "title": man.get("title"), "room": "Scene02 (runtime_room_usd, same shell as layout_v4)",
            "worktop_z": WORKTOP_Z, "benches": {b: BENCH[b] for b in {ROBOT[a]["bench"] for a in groups}},
            "robots": robots, "task_order": man.get("task_order"),
            "placement_rule": {"rows_m": ROW_R, "arc_deg": {a: ARC[a] for a in groups},
                               "reach_band_m": [0.44, 0.76],
                               "rationale": "instruments sit on a reach annulus around the serving arm, ordered along the arc by process order"},
            "prims": prims, "unplaced": unplaced,
            "footprints": "not set here - measured from the USDs by the asset pipeline, then used to resolve fine spacing"}


def main():
    idx = []
    for wf in sorted(SERVED_BY):
        s = build(wf)
        (HERE / f"{wf}.json").write_text(json.dumps(s, ensure_ascii=False, indent=1), encoding="utf-8")
        idx.append((wf, len(s["prims"]), len(s["unplaced"]), sorted(s["robots"])))
        print(f'{wf:34s} prims={len(s["prims"]):3d} unplaced={len(s["unplaced"])} arms={",".join(sorted(s["robots"]))}')
    return idx


if __name__ == "__main__":
    main()
