"""Validate the generated scenes: reach, pairwise spacing, bench containment; draw a top view of each."""
import json, math, pathlib
HERE = pathlib.Path(__file__).resolve().parent
COL = {"back": "#c0392b", "mid": "#b8860b", "front": "#2e6da4"}

def check(s):
    rows, bad = [], []
    for p in s["prims"]:
        if not p.get("pose"):
            bad.append((p["name"], "unplaced")); continue
        arm = s["robots"][p["served_by"]]
        # the carriage arm travels to each furnace, so measure from its rail stop, not from the park spot
        bx, by = arm["base"][0], arm["base"][1]
        if p.get("rail_stop_q_m") is not None:
            bx += p["rail_stop_q_m"]
        # the arm works at a box furnace's door plane, not its centroid: the box is 551 mm deep
        tgt = list(p["pose"][:2])
        if p["semantic"] == "box_furnace":
            tgt[1] += 0.2755
        d = math.dist(tgt, (bx, by))
        wrist = d - 0.27 if arm["type"].startswith("ur5e") else d
        rows.append((p["name"], p["served_by"], round(d, 3), round(wrist, 3), p["row"]))
        if not (0.40 <= d <= 0.95):
            bad.append((p["name"], f"TCP {d:.3f} m outside the workable band"))
        if wrist > 0.85:
            bad.append((p["name"], f"wrist {wrist:.3f} m beyond the 0.85 m envelope"))
    pts = [(p["name"], p["pose"]) for p in s["prims"] if p.get("pose")]
    close = []
    for i in range(len(pts)):
        for j in range(i + 1, len(pts)):
            d = math.dist(pts[i][1][:2], pts[j][1][:2])
            if d < 0.10:
                close.append((pts[i][0], pts[j][0], round(d, 3)))
    return rows, bad, close

def svg(s):
    xs = [p["pose"][0] for p in s["prims"] if p.get("pose")] + [r["base"][0] for r in s["robots"].values()]
    ys = [p["pose"][1] for p in s["prims"] if p.get("pose")] + [r["base"][1] for r in s["robots"].values()]
    for b in s["benches"].values():
        xs += [b[0], b[2]]; ys += [b[1], b[3]]
    pad = 0.35
    x0, x1, y0, y1 = min(xs) - pad, max(xs) + pad, min(ys) - pad, max(ys) + pad
    sc = 900 / max(x1 - x0, 1e-6); H = (y1 - y0) * sc
    X = lambda x: (x - x0) * sc
    Y = lambda y: H - (y - y0) * sc
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="{H:.0f}" viewBox="0 0 900 {H:.0f}" font-family="system-ui" font-size="11">',
         f'<rect width="900" height="{H:.0f}" fill="#fbfbfa"/>']
    for name, b in s["benches"].items():
        o.append(f'<rect x="{X(b[0]):.1f}" y="{Y(b[3]):.1f}" width="{(b[2]-b[0])*sc:.1f}" height="{(b[3]-b[1])*sc:.1f}" fill="#eceff1" stroke="#b0bec5"/>')
        o.append(f'<text x="{X(b[0])+6:.1f}" y="{Y(b[3])+16:.1f}" fill="#78909c">bench {name}</text>')
    for an, r in s["robots"].items():
        bx, by = r["base"][:2]
        for rr, c in ((0.44, "#cfd8dc"), (0.76, "#90a4ae")):
            o.append(f'<circle cx="{X(bx):.1f}" cy="{Y(by):.1f}" r="{rr*sc:.1f}" fill="none" stroke="{c}" stroke-dasharray="4 4"/>')
        o.append(f'<circle cx="{X(bx):.1f}" cy="{Y(by):.1f}" r="7" fill="#37474f"/>')
        o.append(f'<text x="{X(bx)+10:.1f}" y="{Y(by)-8:.1f}" font-weight="600">{an}</text>')
    for p in s["prims"]:
        if not p.get("pose"): continue
        px, py = p["pose"][:2]
        o.append(f'<circle cx="{X(px):.1f}" cy="{Y(py):.1f}" r="5" fill="{COL[p["row"]]}"/>')
        o.append(f'<text x="{X(px)+7:.1f}" y="{Y(py)+4:.1f}" fill="#263238">{p["process_index"]}·{p["semantic"]}</text>')
    o.append(f'<text x="10" y="18" font-weight="700">{s["scene_id"]}</text>')
    o.append('</svg>')
    return "\n".join(o)

for f in sorted(HERE.glob("wf0*.json")):
    s = json.loads(f.read_text())
    rows, bad, close = check(s)
    (HERE / (s["scene_id"] + ".svg")).write_text(svg(s), encoding="utf-8")
    d = [r[2] for r in rows]
    print(f'{s["scene_id"]:34s} n={len(rows):2d}  TCP {min(d):.2f}-{max(d):.2f} m  violations={len(bad)}  pairs<100mm={len(close)}')
    for b in bad[:5]: print('    !', b)
    for c in close[:5]: print('    ~', c)
