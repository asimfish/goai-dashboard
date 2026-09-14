"""Close the reagent-bottle caps at the ASSET layer.

The bottle assets ship a `*_Lid` mesh that is a hollow screw collar with no top face, so every capped
bottle renders as a bare ring you can see straight down into. Runtime patching cannot fix this:
with `use_fabric=True` the scene delegate does not pick up prims added after `sim.reset()`, which was
verified over five attempts. It has to be baked into a layer that is present when the stage opens.

These wrappers are plain USDA, so the fix is a text edit: inside the existing `over "<Bottle>_Lid"`
block, add a thin disc as a child of the lid, and bind it to a material defined in this same wrapper.
The disc must carry its OWN material - the lid's material has an opacity cutout that erases the disc
on default cylinder UVs, which is what defeated the earlier runtime attempts.

The disc has no collision API, so settle / contact-separation / reach results stay valid: only the
picture changes.

Local lid geometry, measured on the composed v4 stage:
    ReagentBottle001 / 002 (large)  radius 0.0265 m, top face at local z = +0.0132
    ReagentBottle003 / 004 (small)  radius 0.0258 m, top face at local z = +0.0133
"""
import pathlib, re, shutil, sys

SRC = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".")
DST = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else "./capfix_out")

# bottle family -> (collar radius m, top-face local z m)
FAMILY = {"ReagentBottle001": (0.0265, 0.0132), "ReagentBottle002": (0.0265, 0.0132),
          "ReagentBottle003": (0.0258, 0.0133), "ReagentBottle004": (0.0258, 0.0133)}
WRAPPERS = ["ethanol", "precursor_1", "precursor_2", "precursor_3", "precursor_4",
            "stock_1", "stock_2", "stock_3", "stock_4"]
INSET = 0.985          # keep the disc just inside the collar so it never pokes through the rim
THICK = 0.0018

MATERIAL = '''
    def Material "CapTopMat"
    {
        token outputs:surface.connect = </Asset/CapTopMat/Shader.outputs:surface>

        def Shader "Shader"
        {
            uniform token info:id = "UsdPreviewSurface"
            color3f inputs:diffuseColor = (0.11, 0.42, 0.16)
            float inputs:metallic = 0
            float inputs:opacity = 1
            float inputs:roughness = 0.45
            token outputs:surface
        }
    }
'''


SEG = 48        # ring segments for the disc


def disc_block(radius: float, ztop: float, indent: str) -> str:
    """Emit the cap top as an explicit triangulated Mesh, not a UsdGeom.Cylinder.

    Every earlier attempt - five at runtime and the first asset-layer one - created the disc as a
    UsdGeom.Cylinder, and every one of them produced geometry that was verifiably in the right place
    yet never appeared in an RTX render. An implicit gprim that the RTX delegate does not tessellate
    would behave exactly like that, so this writes real triangles and removes the question.
    """
    import math
    r = round(radius * INSET, 5)
    ztl = round(ztop, 5)
    zbl = round(ztop - THICK, 5)
    pts, counts, idx = [], [], []
    pts.append((0.0, 0.0, ztl))                                   # 0: top centre
    for i in range(SEG):
        a = 2 * math.pi * i / SEG
        pts.append((round(r * math.cos(a), 6), round(r * math.sin(a), 6), ztl))
    base = len(pts)
    pts.append((0.0, 0.0, zbl))                                   # bottom centre
    for i in range(SEG):
        a = 2 * math.pi * i / SEG
        pts.append((round(r * math.cos(a), 6), round(r * math.sin(a), 6), zbl))
    for i in range(SEG):                                          # top fan, CCW seen from +Z
        counts.append(3); idx += [0, 1 + i, 1 + (i + 1) % SEG]
    for i in range(SEG):                                          # bottom fan, reversed winding
        counts.append(3); idx += [base, base + 1 + (i + 1) % SEG, base + 1 + i]
    for i in range(SEG):                                          # rim quads so the disc has thickness
        a0, a1 = 1 + i, 1 + (i + 1) % SEG
        b0, b1 = base + 1 + i, base + 1 + (i + 1) % SEG
        counts.append(4); idx += [a0, b0, b1, a1]
    ps = ", ".join(f"({x}, {y}, {z})" for x, y, z in pts)
    body = f'''
def Mesh "TopFace" (
    prepend apiSchemas = ["MaterialBindingAPI"]
)
{{
    uniform bool doubleSided = 1
    float3[] extent = [(-{r}, -{r}, {zbl}), ({r}, {r}, {ztl})]
    int[] faceVertexCounts = [{", ".join(str(c) for c in counts)}]
    int[] faceVertexIndices = [{", ".join(str(i) for i in idx)}]
    rel material:binding = </Asset/CapTopMat>
    point3f[] points = [{ps}]
    uniform token subdivisionScheme = "none"
}}
'''
    return "".join(indent + ln if ln.strip() else ln for ln in body.splitlines(keepends=True))


def patch(text: str, name: str) -> str:
    m = re.search(r'over "(ReagentBottle\d+)_Lid"\s*\(', text)
    if not m:
        raise SystemExit(f"{name}: no lid over-block found")
    fam = m.group(1)
    if fam not in FAMILY:
        raise SystemExit(f"{name}: unknown bottle family {fam}")
    radius, ztop = FAMILY[fam]
    # find the opening brace of the lid block and its indent
    brace = text.index("{", m.end())
    line_start = text.rfind("\n", 0, brace) + 1
    indent = re.match(r"[ \t]*", text[line_start:]).group(0) + "    "
    if "TopFace" in text:
        return text                                  # already patched
    out = text[:brace + 1] + "\n" + disc_block(radius, ztop, indent) + text[brace + 1:]
    # add the disc's own material next to the Asset root, after the rigid-body attributes
    am = re.search(r'def Xform "Asset"[^{]*\{', out)
    out = out[:am.end()] + MATERIAL + out[am.end():]
    return out


def main():
    DST.mkdir(parents=True, exist_ok=True)
    done = []
    for w in WRAPPERS:
        f = SRC / f"{w}.usda"
        if not f.exists():
            print(f"  MISSING {f}"); continue
        t = f.read_text(encoding="utf-8")
        p = patch(t, w)
        (DST / f"{w}.usda").write_text(p, encoding="utf-8")
        fam = re.search(r'over "(ReagentBottle\d+)_Lid"', t).group(1)
        done.append((w, fam, FAMILY[fam]))
        print(f"  capped {w:12s} {fam}  r={FAMILY[fam][0] * INSET:.5f}  ztop={FAMILY[fam][1]}")
    print(f"{len(done)} wrappers written to {DST}")


if __name__ == "__main__":
    main()
