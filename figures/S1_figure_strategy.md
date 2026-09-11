# S1 · Figure strategy — 头图候选与 prompt package（super_teaser 结构，含无生图通道时的矢量替代）

## 八个风格组合提案 → 选四（C01–C04）
| # | 版式语法（结构先于表面） | 表面处理 | 评分要点 | 选 |
|---|---|---|---|---|
| 1 | 左→右四列：证据等级 → 记录 → 表征 → 用途，门形判定 | 技术线稿（印刷优先，可见 port，一强调色） | 直接回答主读者问题；灰度可辨 | **C01** |
| 2 | 同上，但"统一实验记录"作为中央瓶颈放大，等级用线宽 | 编辑式机制图（白底，稀疏矩阵纹样） | 突出"条件抽取是瓶颈" | **C02** |
| 3 | 上→下：证据金字塔（T1 顶）→ 记录表 → 判定 | 清洁模块 | 强调等级层次 | C03 |
| 4 | 环：文献 → 条件 → 实验 → 表征 → 反馈到组成 | 编辑式 | 强调闭环，但论文主体不是闭环实验 | 否（超出证据） |
| 5 | 泳道：五条路线各一道，汇入记录 | 技术线稿 | 与图 3 重复 | 否 |
| 6 | 中央核心：目标相在中心，四级证据环绕 | 注释式机制图 | 适合"谱系重审"小节，不适合全文头图 | C04（作为局部候选） |
| 7 | 表格化矩阵：等级 × 条件项 | 矩阵处理 | 信息完整但不是"框架图" | 否 |
| 8 | 三视图拼贴（相图 + 结构 + 衍射） | 插画式 | 现有 fig03 的路线；证据不足（无数据） | 否 |

## C01（已实现为矢量候选 F01：`figspec/fig01_F01_line_art.json`）
- 版式：1500×790，四列；证据等级五行；记录列内五条件行；表征列四方法行；琥珀菱形"可迁移判定"；用途四行。
- Edge/port contract：每条边写明源端口、目的端口、承载量：T1→p1"完整处方·1 篇"、T2→p2"相区·结构核验"、T3→p3"结构关系·竞争相"、T4→p4"过程变量·表征方法"、记录→表征"同一实验项目下比较"、判定→用途"数值可复现 / 方法+相区 / 仅变量结构"、T0→排除（虚线，开放箭头）。
- 可见文字白名单：等级标签 T0–T4、五项条件、四种表征、四种用途、判定语"近邻条件 ≠ 已验证配方"。
- 调色：白底、炭黑线（#1F2E36）、单一强调色琥珀（#B06A12）只用于 T1 与判定；等级由线宽承载。
- 密度预算：主体占画布 ≥ 80%；无空象限；图例一行；不加背景插图。

## 生图 prompt package（S2 用，待图像通道恢复；Codex `image_gen` 或 ChatGPT Images）
```
Opaque white page, dark charcoal lettering and arrowheads, technical line-art schematic for a materials-synthesis literature survey. Four aligned columns, left to right:
(1) "Literature evidence, graded by relation to the target phase" — five stacked rectangles T1..T4 and T0: T1 "Direct report of Ba5Y12Zn[O(SiO4)]8 — high-temperature solution, Pt crucible, single-crystal structure; only one paper" drawn with a heavy amber outline; T2 "Same Ba–Y–Si–O tetragonal lineage — composition scans and structure checks are comparable" solid; T3 "Crystal-chemical neighbours (Ba–Zn–Si–O, Y–Si–O) — structural relations and competing phases" medium; T4 "Process neighbours (flux, melt, solid-state, Czochralski) — process variables and characterisation methods" thin; T0 "Out of scope" dashed grey.
(2) A single module "Unified experiment record (extract → normalise → compare across routes)" with five internal rows: composition & precursors; temperature–time; atmosphere & open/closed system; crucible & flux/mineraliser; cooling · growth · separation. Four small square input ports on its left edge receive one bundled connector from each of T1–T4; connector labels carry what each tier supplies ("complete recipe, 1 paper", "phase region · structure check", "structural relations · competing phases", "process variables · methods"). Line weight encodes the tier; amber only for T1.
(3) A module "Complementary characterisation" with four rows: single-crystal/advanced diffraction; PXRD/Rietveld; composition & contamination (EDS/EPMA); high-temperature stability. One bundled connector from the record's right port labelled "compared under the same experiment items".
(4) An amber diamond gate "Transferability decision — neighbour conditions ≠ validated recipe" feeding four outputs: "Direct reproduction (T1 only): numbers reproducible" (amber, heavy), "Lineage phase diagram & structure comparison (T2): methods + phase region", "Method & variable structure (T3/T4): variables only, no numerical transfer", and a dashed grey "Excluded from condition comparison (T0)".
Hard constraints: no gradients, no neon, no glossy 3D, no decorative icons, no invented data curves; every arrow direction as specified; variables appear only on connectors and record rows, never as peer boxes; grayscale-legible; canvas 170 mm wide, lettering ≥ 7 pt equivalent.
```
- C02–C04 的 prompt 只改版式段落（中央瓶颈 / 上下金字塔 / 中央核心），硬约束段落相同。

## 与 goai_research 的接线
- `skills/goai-figure-studio/SKILL.md` 增加路由：图像生成工具可用 → 走 super_teaser S0–S5（S0/S1 产物即本目录两份 md），把 S5 终选 PNG 作为头图并保留 figspec 矢量版做可编辑源；不可用 → figspec 按"印刷优先技术线稿"契约出图（本候选即样板）。
- `figspec.lint` 已有配色/字号/遮挡规则；补充"变量不得作同级模块"（边标签优先）的检查项作为后续工作。
