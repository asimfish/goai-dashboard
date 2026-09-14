"""Measure the footprint of every asset the five workflow scenes need.

This is the one piece the placement spec was missing. It needs pxr, which the system python does not
have - but `handoff/collection_astra/usd_python.sh` puts the Isaac USD libraries on the path without
starting Kit, so this opens the USDs directly: no renderer, no physics, no GPU.

For each asset it reports the axis-aligned size, the origin-to-bottom offset (what the placement
needs to sit it on a worktop) and whether it carries a physics articulation.

    bash usd_python.sh measure_assets.py <registry.json> <asset_root> <out.json> <key> [key ...]
"""
import json, sys
from pxr import Usd, UsdGeom, UsdPhysics


def measure(path: str) -> dict:
    stage = Usd.Stage.Open(path)
    if not stage:
        return {"error": "stage would not open"}
    root = stage.GetDefaultPrim() or stage.GetPseudoRoot()
    cache = UsdGeom.BBoxCache(Usd.TimeCode.Default(), ["default", "render"], useExtentsHint=False)
    rng = cache.ComputeWorldBound(root).ComputeAlignedRange()
    if rng.IsEmpty():
        return {"error": "empty bound"}
    lo, hi = rng.GetMin(), rng.GetMax()
    art = any(p.HasAPI(UsdPhysics.ArticulationRootAPI) for p in Usd.PrimRange(root))
    joints = [p.GetName() for p in Usd.PrimRange(root) if p.IsA(UsdPhysics.Joint)][:8]
    meshes = sum(1 for p in Usd.PrimRange(root) if p.IsA(UsdGeom.Mesh))
    return {
        "size_m": [round(hi[i] - lo[i], 4) for i in range(3)],
        "bbox_min": [round(v, 4) for v in lo], "bbox_max": [round(v, 4) for v in hi],
        # how far the asset's own origin sits above its lowest point: add this to the worktop z
        "origin_to_bottom_m": round(-lo[2], 4),
        "footprint_xy_m": [round(hi[0] - lo[0], 4), round(hi[1] - lo[1], 4)],
        "articulated": bool(art), "joints": joints, "mesh_count": meshes,
    }


def main():
    reg_path, asset_root, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    keys = sys.argv[4:]
    reg = json.load(open(reg_path))
    assets = reg.get("assets", reg)
    out = {}
    for k in keys:
        entry = assets.get(k)
        if not entry:
            out[k] = {"error": "not in registry"}
            print(f"  {k:34s} NOT IN REGISTRY", flush=True)
            continue
        p = f"{asset_root}/{entry['usd']}"
        try:
            out[k] = measure(p)
            out[k]["usd"] = entry["usd"]
        except Exception as e:
            out[k] = {"error": f"{type(e).__name__}: {e}", "usd": entry["usd"]}
        r = out[k]
        if "size_m" in r:
            s = r["size_m"]
            print(f'  {k:34s} {s[0]:6.3f} x {s[1]:6.3f} x {s[2]:6.3f} m   bottom_off={r["origin_to_bottom_m"]:+.4f}'
                  f'   {"ART" if r["articulated"] else "   "}  meshes={r["mesh_count"]}', flush=True)
        else:
            print(f'  {k:34s} ERROR {r.get("error")}', flush=True)
    json.dump(out, open(out_path, "w"), ensure_ascii=False, indent=1)
    ok = sum(1 for v in out.values() if "size_m" in v)
    print(f"measured {ok}/{len(keys)} -> {out_path}")


if __name__ == "__main__":
    main()
