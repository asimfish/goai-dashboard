# v4 scene fidelity and five-workflow coverage review

审查时间：2026-09-14（5090 副本）；布局：layout_v4；计划 SHA256：`59288fd78c1013f5a8c47a491aa8da1c19cabec2e89ba321c91dd5f12f0f3331`.

本审查按 A-Lab 论文（Szymanski et al., Nature 624, 86–91, DOI [10.1038/s41586-023-06734-w](https://doi.org/10.1038/s41586-023-06734-w)）的三站结构和本地 `ED_FIG1_NOTES.md` 比较。论文描述了样品制备、加热、表征三站及机器人转运；本场景的差异和工程代理逐项保留。

## 渲染证据

展示渲染使用独立 `fidelity_review/render_fidelity.py`，RTX GI、透射、反射开启，4 spp；90 tick 静置后每视角 16 tick 预热。渲染脚本只移动临时相机，不隐藏或移动几何；采集用的 `v4_runtime/render_twin.py` 快配置未改。

- 证据目录：`/data/liyufeng/goai_workflows/alab_twin_collect/fidelity_review/renders/`（PNG）
- 视角清单及 eye/target/focal：`fidelity_review/views.json`
- 每图均值、标准差、尺寸、SHA256：`fidelity_review/render_index.json`
- 运行参数与 plan 校验：`fidelity_review/manifest.json`
- 运行时几何 bounds：`fidelity_review/runtime_bounds.json`

### 房间与三站视角对照

| 图像 | 与 A-Lab 对照 | 差距、原因和修法 |
|---|---|---|
| [`overview_1.png`](fidelity_review/renders/overview_1.png) | 论文/ED Fig.1 的整体关系是 R1 居中、炉排与导轨在左、R3/XRD 在右；本图能看到三站同室布局。差距：开放式工程房间替代封闭 Labman 外壳；墙、地面、照明为 SafeLab 房间资产；线缆、品牌铭牌和安全标识未重建。修法：保留工位间距，后续补线缆/标签资产。 |—|
| [`overview_2.png`](fidelity_review/renders/overview_2.png) | 对角线视角检查仪器背面、通道和台面高度。与论文照片相比本图的桌体比例及仪器外壳是代理/缩放资产，未能证明背面线缆与维护间隙。修法：按实测台面高度和资产 bounds 补后侧细节。 |—|
| [`station_a.png`](fidelity_review/renders/station_a.png) | ED Fig.1a 要求 R1 在岛台中央，转盘在臂前、天平右前、混料/研磨左侧、干燥箱后方；v4 满足相对拓扑。差距：FR3 替代三菱六轴，转盘直径 0.90 m 仍小于论文实物约 1 m，Labman 封闭罩缺失。 |—|
| [`a_front.png`](fidelity_review/renders/a_front.png) | 操作者正面检查抓取区与称量/转运台面。差距：开放岛台、代理混料器、缺少真实管线和标牌；补齐资产后重渲染。 |—|
| [`a_side.png`](fidelity_review/renders/a_side.png) | 侧面检查机器人肩部、干燥箱入口和桌边净空。v4 已有 0.25 m pedestal_A；未包含真实电缆拖链/防护罩。 |—|
| [`a_top.png`](fidelity_review/renders/a_top.png) | 俯视检查 A 站环形仪器关系。论文转盘/工具分区更紧凑；v4 的拓扑可操作但实验覆盖尚未含湿法和助熔剂附加器皿。 |—|
| [`station_b.png`](fidelity_review/renders/station_b.png) | ED Fig.1b 要求炉排、门朝导轨、导轨座、坩埚架在两者之间；v4 满足，机器人停 furnace_4 前。差距：导轨固定、不模拟论文逐炉移动；四炉及门为工程代理，缺真实电缆/铭牌。 |—|
| [`b_front.png`](fidelity_review/renders/b_front.png) | 正面检查把手、架体和炉门入口；裸托盘轮廓会被载荷遮挡，按装载整体作业目标。差距：不展示论文蓝色架材质细节和热区标识。 |—|
| [`b_side.png`](fidelity_review/renders/b_side.png) | 侧面检查水平入炉路径和肩部绕行空间。furnace_4 是唯一在固定基座下的任务炉；其余炉入口不可达。 |—|
| [`b_top.png`](fidelity_review/renders/b_top.png) | 俯视检查炉排间距、导轨轴线与架子。论文导轨与炉排平行；v4 几何关系保持，缺移动导轨状态。 |—|
| [`b_row.png`](fidelity_review/renders/b_row.png) | 四炉全排视角，补足单站相机看不到的炉列关系。差距同上：工程炉外壳及固定导轨，需在展示中标注。 |—|
| [`station_c.png`](fidelity_review/renders/station_c.png) | ED Fig.1c 要求 R3 居中，XRD 右端开口朝臂，天平/旋盖左、存储架右前、振摇/投球右后；v4 拓扑满足。差距：UR5e 是论文规定型号但 XRD/旋盖/投球器仍工程代理，缺品牌铭牌和线缆。 |—|
| [`c_front.png`](fidelity_review/renders/c_front.png) | 正面检查瓶架、天平和 XRD 入口。滑窗代理提供可驱动开口；新增 workflow 器皿尚未布置。 |—|
| [`c_side.png`](fidelity_review/renders/c_side.png) | 侧面检查 XRD 水平 holder_0 进机路径。入口几何是可扫掠的，但五工作流覆盖仍缺 Funnel_Stand 等。 |—|
| [`c_top.png`](fidelity_review/renders/c_top.png) | 俯视检查 R3 周围各作业岛；与 ED Fig.1c 的相对关系一致。差距：真实 XRD 内部/门板细节被工程代理简化。 |—|
| [`room_top.png`](fidelity_review/renders/room_top.png) | 房间俯视用于检查通道、三站相对位置；这是展示用高位相机，不代表采集相机。Room walls/ceiling 会造成视野截断时，应以图像和相机清单共同复核。 |—|
| [`a_operator.png`](fidelity_review/renders/a_operator.png) | 肩上操作者视角，检查 FR3 是否遮挡称量纸和转盘。论文 R1 是封闭站中心臂；v4 采用开放岛台工程代理，视野更开但缺罩体。 |—|
| [`b_operator.png`](fidelity_review/renders/b_operator.png) | 肩上视角检查把手和炉口在同一操作画面；v4 对准作业区质心。差距：真实系统有炉门/导轨细节和安全护罩，当前资产为可碰撞代理。 |—|
| [`c_operator.png`](fidelity_review/renders/c_operator.png) | 肩上视角检查 UR5e_C 不遮挡 holder 和瓶架。与论文 R3 位置一致；缺真实控制线缆/标识。 |—|

### 仪器近景（按图逐项观察）

近景审查只记录图上实际可见内容。无异常项写“未见明显异常”，不以模板句替代观察。

| 图像 | 实际观察 |
|---|---|
| [`close_balance.png`](fidelity_review/renders/close_balance.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_ball_dispenser.png`](fidelity_review/renders/close_ball_dispenser.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_capper.png`](fidelity_review/renders/close_capper.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_carousel.png`](fidelity_review/renders/close_carousel.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_carousel_crucible_0.png`](fidelity_review/renders/close_carousel_crucible_0.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_carousel_crucible_1.png`](fidelity_review/renders/close_carousel_crucible_1.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_carousel_crucible_2.png`](fidelity_review/renders/close_carousel_crucible_2.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_carousel_crucible_3.png`](fidelity_review/renders/close_carousel_crucible_3.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_carousel_crucible_4.png`](fidelity_review/renders/close_carousel_crucible_4.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_carousel_crucible_5.png`](fidelity_review/renders/close_carousel_crucible_5.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_carousel_rack_1.png`](fidelity_review/renders/close_carousel_rack_1.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_carousel_rack_2.png`](fidelity_review/renders/close_carousel_rack_2.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_chair.png`](fidelity_review/renders/close_chair.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_crucible_1.png`](fidelity_review/renders/close_crucible_1.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_crucible_2.png`](fidelity_review/renders/close_crucible_2.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_crucible_3.png`](fidelity_review/renders/close_crucible_3.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_crucible_4.png`](fidelity_review/renders/close_crucible_4.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_crucible_A0.png`](fidelity_review/renders/close_crucible_A0.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_crucible_rack_1.png`](fidelity_review/renders/close_crucible_rack_1.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_crucible_rack_2.png`](fidelity_review/renders/close_crucible_rack_2.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_dosing_balance.png`](fidelity_review/renders/close_dosing_balance.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_drying_oven.png`](fidelity_review/renders/close_drying_oven.png) | 看到 FR3_A 的前臂进入门前画面并遮住一部分入口；门体本身可见，需用操作者视角复核净空。 |
| [`close_ethanol.png`](fidelity_review/renders/close_ethanol.png) | 看到试剂瓶盖为透明/有色空心螺纹环，能看到瓶口内部；需资产层修复。 |
| [`close_fr3_A.png`](fidelity_review/renders/close_fr3_A.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_furnace_1.png`](fidelity_review/renders/close_furnace_1.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_furnace_2.png`](fidelity_review/renders/close_furnace_2.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_furnace_3.png`](fidelity_review/renders/close_furnace_3.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_furnace_4.png`](fidelity_review/renders/close_furnace_4.png) | 看到炉门、显示窗和把手完整，未见几何异常；机器人待命姿态另由站点图审查。 |
| [`close_holder_0.png`](fidelity_review/renders/close_holder_0.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_mixer.png`](fidelity_review/renders/close_mixer.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_mortar.png`](fidelity_review/renders/close_mortar.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_mount_B.png`](fidelity_review/renders/close_mount_B.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_mount_C.png`](fidelity_review/renders/close_mount_C.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_paper.png`](fidelity_review/renders/close_paper.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_pc.png`](fidelity_review/renders/close_pc.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_pedestal_A.png`](fidelity_review/renders/close_pedestal_A.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_pestle.png`](fidelity_review/renders/close_pestle.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_pipette.png`](fidelity_review/renders/close_pipette.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_precursor_1.png`](fidelity_review/renders/close_precursor_1.png) | 看到绿色透明盖是空心螺纹环，可直接看进瓶颈，顶部没有封面；这是盖资产缺陷，需在资产层补实心顶面。 |
| [`close_precursor_2.png`](fidelity_review/renders/close_precursor_2.png) | 看到绿色透明盖是空心螺纹环，可直接看进瓶颈，顶部没有封面；与 precursor_1 同一盖资产缺陷。 |
| [`close_precursor_3.png`](fidelity_review/renders/close_precursor_3.png) | 看到蓝色透明盖是空心螺纹环，可直接看进瓶颈，顶部没有封面；需资产层修复。 |
| [`close_precursor_4.png`](fidelity_review/renders/close_precursor_4.png) | 看到橙色透明盖是空心螺纹环，可直接看进瓶颈，顶部没有封面；需资产层修复。 |
| [`close_rail.png`](fidelity_review/renders/close_rail.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_server_rack.png`](fidelity_review/renders/close_server_rack.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_shaker.png`](fidelity_review/renders/close_shaker.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_stock_1.png`](fidelity_review/renders/close_stock_1.png) | 看到试剂瓶盖是空心螺纹环，瓶颈从上方可见；需资产层修复。 |
| [`close_stock_2.png`](fidelity_review/renders/close_stock_2.png) | 看到试剂瓶盖是空心螺纹环，瓶颈从上方可见；需资产层修复。 |
| [`close_stock_3.png`](fidelity_review/renders/close_stock_3.png) | 看到试剂瓶盖是空心螺纹环，瓶颈从上方可见；需资产层修复。 |
| [`close_stock_4.png`](fidelity_review/renders/close_stock_4.png) | 看到试剂瓶盖是空心螺纹环，瓶颈从上方可见；需资产层修复。 |
| [`close_stock_rack.png`](fidelity_review/renders/close_stock_rack.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_store_rack_1.png`](fidelity_review/renders/close_store_rack_1.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_store_rack_2.png`](fidelity_review/renders/close_store_rack_2.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_tongs.png`](fidelity_review/renders/close_tongs.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_transfer_rack.png`](fidelity_review/renders/close_transfer_rack.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_ur5e_B.png`](fidelity_review/renders/close_ur5e_B.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_ur5e_C.png`](fidelity_review/renders/close_ur5e_C.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_vacuum.png`](fidelity_review/renders/close_vacuum.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_vial_1.png`](fidelity_review/renders/close_vial_1.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_vial_2.png`](fidelity_review/renders/close_vial_2.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_vial_3.png`](fidelity_review/renders/close_vial_3.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_vial_rack.png`](fidelity_review/renders/close_vial_rack.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_vial_rack_a.png`](fidelity_review/renders/close_vial_rack_a.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_waste.png`](fidelity_review/renders/close_waste.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |
| [`close_xrd.png`](fidelity_review/renders/close_xrd.png) | 看到 XRD 前方被 UR5e_C 的前臂和腕部占据，滑窗/入口仍可辨识；站位或相机需在任务视角复核。 |
| [`close_xrd_holder_rack.png`](fidelity_review/renders/close_xrd_holder_rack.png) | 未见明显异常。该图用于确认外形、落台和可见性；功能仍需对应工作流扫掠验证。 |

瓶盖问题集中在 9 个试剂瓶近景（precursor_1–4、stock_1–4、ethanol）：透明/有色空心螺纹环不是可接受的封盖几何。该项交给资产层修复；运行时补圆盘无效，不在 5090 副本重复修改。

## 五个工作流覆盖与可执行性

判断规则：资产存在只证明外形可加载；只有对应功能资产、放置面、入口净空和机器人包络都具备才算可执行。以下是当前 v4（62 prims）的结果；4090 补资产后必须重新做 bounds、碰撞扫掠和 G3。资产注册表中已确认缺口资产可取得（例如 `art:MagneticStirrer001`、`art:HighSpeedCentrifuge001`、`art:ReagentCabinet001`、`Funnel_Stand`、`Erlenmeyer_Flask_With_Stopper`、`Centrifuge_Tube`），但它们尚未进入当前 plan。

| 状态 | 工作流 | 当前证据 | 几何/功能结论 |
|---|---|---|---|
| wf01 solid-state calcination | PASS* | balance, mortar, crucible racks, furnace_4, carousel and drying oven present; 4 furnace doors exposed | *Geometry supports the demonstrated furnace_4 path only. Fixed rail means furnaces 1–3 are not geometrically serviceable (distances 2.600/1.877/1.290 m vs furnace_4 1.087 m from base). |
| wf02 powder recovery + XRD | FAIL | xrd, balance, mortar, holder_0 and racks present | Funnel_Stand is absent from 62 prims. The recover step cannot be executed without the stand; add registry asset and holder placement, then rerun sweep. |
| wf03 wet-chemical precursor | FAIL | mixer prim uses `articulated/HighSpeedCentrifuge001` but no `art:MagneticStirrer001`, pH station, cylinder, beaker, centrifuge tube or evaporating dish | A centrifuge-shaped source cannot satisfy a magnetic-stirrer operation; `waste` is a 500 mL beaker proxy, not a waste vessel. Required placements are absent, so LiquidHandling→Measurement→Mixing→Drying is not executable. |
| wf04 flux growth, Pt crucible | FAIL | generic Crucible, tongs, furnace and carousel present | Funnel_Stand, Erlenmeyer flask with stopper, filter paper and Pt crucible are absent. Generic Crucible must not be counted as Pt material. |
| wf05 reagent logistics + safety | FAIL | bottles, balance and tongs present | Reagent cabinet, BottleTopDispenser station and a waste container are absent; no open/dispense/return/dispose chain can be swept. |

### 可达性与关键尺寸（当前 v4）

- `ur5e_B` 基座 `(-1.385,-1.805,1.1897)`；`crucible_rack_2` 把手 TCP 距基座 **0.577 m**，炉内投放航点腕部距基座 **0.655 m**。导轨在 plan 中 `articulated: false`，座固定在 furnace_4 前。由此 677 mm 失败不能归因于布局包络；应归入 `go()` 提前返回/执行器诊断。
- furnace_4 入口约 1.087 m（腕部约 0.655 m、TCP 路径约 0.79 m）；furnace_3/2/1 到基座约 1.290/1.877/2.600 m，固定座下不作业。
- `ur5e_C` 基座 `(2.3,-2.4,1.0288)`；`holder_0` 距基座约 0.381 m，属于近基座薄弱环；XRD 滑窗入口按 `JOINT_OPERATION.json` 为 prismatic X、行程 0.480 m、开目标 0.4795 m。
- 运行时已有 v4 证据可直接引用：62 物件静置最大位移 0.0005 mm/0.0557°；器材间最小分离 0.25–0.40 mm；真实 TCP 可达 FR3 96%、UR5e_B 91%、UR5e_C 94%；三站固定相机实例遮挡均通过。见 `/data/liyufeng/goai_workflows/alab_twin/v4render/` 的 `v4_check.json`, `v4_contacts.json`, `v4_reach.json`, `v4_vis.json`。

### 结论与门控

当前场景的三站主链（wf01 的 furnace_4 路径、wf02 的称量/XRD 几何骨架）可作为审查基线；五个实验整体 **未通过覆盖门**：wf02–wf05 缺关键资产/功能，不能开始正式采集。4090 完成补资产与布局后，应重新渲染本清单所有近景并执行入口扫掠；之后才回到 `go()` 早退诊断、G3 和采集。

### 证据来源

- [Nature A-Lab article](https://www.nature.com/articles/s41586-023-06734-w)（三站与机器人转运）；本地 `_shared/04_five_workflows.md`（五条任务逐步定义）；本地 `layout_v3/ED_FIG1_NOTES.md`（图 1/2 拓扑和已知代理差异）。
- 资产可得性逐键核对 `_shared/safelab_asset_registry.json`；当前 plan 的 62 个 prim 来自 v4 `placement_plan.json`。

### 分步几何门槛（补资产后的复核表）

“资产存在”只证明可加载；功能资产、放置面、入口净空和真实 TCP 包络都必须有数字。`待布置`表示当前没有世界坐标，不能用猜测宣布通过；4090 写入新 plan 后需填实测距离、支撑面 z、bounds 和扫掠分离。

| 工作流/步骤 | 目标与放置面 | 当前几何数字/门槛 | 当前结论 |
|---|---|---|---|
| wf01 t_dose/t_grind/t_load | A 台面 z≈1.003 m；纸/坩埚/转盘 bounds 已在 plan | FR3 reach 96%；转盘直径 0.90 m；静态器材分离 0.25–0.40 mm | PASS*（现有固相路径） |
| wf01 t_heat/t_store | furnace_4 门 1.5 rad；固定 B 座 | furnace_4 腕部距 B 基座 0.655 m、TCP 约 0.79 m；炉 1/2/3 距基座 2.600/1.877/1.290 m | furnace_4 可验；炉 1–3 FAIL（固定导轨） |
| wf02 t_recover | Funnel_Stand + 瓶/漏斗共同台面 | Funnel_Stand 坐标及台面 z 缺失 | FAIL，不能扫掠 |
| wf02 t_prep/t_xrd | holder_0 与 XRD 滑窗 | holder_0 距 C 基座 0.381 m；滑窗行程 0.480 m、开目标 0.4795 m | 几何骨架可验；完整流程 FAIL（前置漏斗缺失） |
| wf03 t_meter/t_ph | 量筒、烧杯、pH 计、搅拌台放置面 | 四类目标坐标均缺失；`mixer` 实际是离心机资产 | FAIL，待补后量化 |
| wf03 t_spin/t_dry | 离心管、离心机盖、废液容器、蒸发皿/代理、干燥箱搁板 | 当前无对应 prim；入口/盖净空 N/A；干燥箱门虽有 v4 开合证据，搁板目标缺失 | FAIL |
| wf04 t_dose/t_grow | Pt 坩埚、托盘、箱式炉 | 仅 generic Crucible；Pt 材料和过滤器皿缺失；furnace_4 数字同 wf01 | FAIL |
| wf04 t_leach/t_filter | 烧杯、磁力搅拌台、Funnel_Stand、锥形瓶、滤纸 | 新 prim 的世界 pose、support z、TCP 距离均 N/A | FAIL |
| wf05 t_get/t_return | ReagentCabinet 门/把手和取放面 | 当前无 `art:ReagentCabinet001`；门行程/把手坐标 N/A | FAIL |
| wf05 t_dispense/t_dispose | BottleTopDispenser、称量面、废液桶 | registry 有 dispenser 但当前 plan 无；`waste` 是烧杯代理；入口 N/A | FAIL |

补资产验收统一门槛：静态器材间分离 ≥0 mm，运行时外部接触负值为 0；真实 TCP 误差 ≤10 mm；门/盖跟踪误差 ≤3°；插入扫掠外部接触 0 tick；每个新物件给出 world pose、support prim、surface z、bounds。缺任一数字保持 FAIL。

**展示渲染校正记录：** 首轮 `room_top` 在 z=10 m 屋外视角只拍到天花板；随后改为 z=3.30 m、4 mm 等效焦距的屋内高位视角，现可见整间房间并纳入最终 84 张索引。此修正只影响展示审查脚本。

## 独立工作流场景的环带与导轨约束（第 13–15 轮更新）

`PLACEMENT_STANDARD.md` 的三排规则用于同一台面内对齐；在三个新场景中先应用机器人环带约束，再在每条环带内用三排规则。环带中心是对应机器人基座，任务仪器的真实 TCP 目标优先落在 0.45–0.75 m；0.30–0.45 m 只作近基座小件，0.75–0.82 m 是 UR5e 的薄弱外环，超过 0.82 m 禁止落位。验收仍以真实 TCP、姿态和碰撞扫掠为准，不能用标称臂展替代。

### 可直接交给 4090 的测量约束

- `ur5e_B` 当前基座 `(−1.385,−1.805,1.1897)`，炉中心 y≈−2.885，故保守 Δy=1.080 m。以腕部 0.85 m、TCP 偏置 0.27 m 得总 TCP 半径 1.12 m，允许的中心线 Δx = **±0.294 m**。这是按炉中心的保守上界；实际门口 y 若更近，必须重新用实测门平面计算并取更小者。
- 炉中心 x=`−3.750, −2.920, −2.090, −1.260`。沿用 v4 已验证的 `base_x = furnace_center_x − 0.125 m`，推荐小车基座停靠：**furnace_1 −3.875、furnace_2 −3.045、furnace_3 −2.215、furnace_4 −1.385 m**。有效工作行程 **[−3.875,−1.385] m，2.490 m**；加 ±0.169 m 端部余量的轨道准入区间 **[−4.044,−0.966] m，3.078 m**。现有轨道几何 x bounds 约 [−4.30,0.00]，容纳该区间。
- `crucible_rack_2` 把手 x≈−1.025、y≈−2.250，当前 furnace_4 停靠点 TCP 距基座 **0.577 m**；应在 furnace_4/装载位抓取后沿轨运动，不能要求 rack 在 furnace_1 停靠点仍与固定装载位同时可达。沿轨移动带载架的每个停靠点都要做 carried-AABB 扫掠，外部接触 0 tick。
- 这组行程不是把 `rail` 直接标成可动就算通过：4090 新 plan 必须给 `prismatic` 关节轴 X、限位至少覆盖上述区间、停靠点表、负载时轨道/机器人基座碰撞过滤；5090 再复核四门净空和四个入口扫掠。
- wf03/wf04/wf05 的每台大型仪器应先落在各自机器人环带，再按 `PLACEMENT_STANDARD.md` 后排（大型）、中排 600 mm、前排 80 mm；同排净距统一且 ≥100 mm。若环带与三排冲突，移动仪器/换环带，不把仪器放到包络外。

### 美观与流程自检（v4 实测）

1. **流程顺序：FAIL（A/C）**。B 炉排的四台大型仪器顺序清楚；A/C 设备分散在 1.53 m 台面深度，不能从一头读出 wf01/wf02 流程。新场景应按工作流沿弧顺序排列。
2. **对齐：PARTIAL**。B 炉退让均 975 mm、yaw=180、同排间距 129 mm，合格；A 退让 70/267/310/415/490/630/651/855/1101/1125 mm，C 为 78/105/228/328/372/557/675/793/1145/1243/1265/1304 mm，均未达三基准线。新场景用后沿/600/80 mm 基准线。
3. **间距：PARTIAL/FAIL（A/C）**。B 的炉排一致；A/C 没有统一同排间距证据。新 plan 需逐排输出相邻净距，所有值 ≥100 mm 且同排统一。
4. **小件收纳：FAIL（A/C）**。渲染中瓶、坩埚、玻璃器皿和称量纸散置在台面或临时架上；新增场景必须把它们归入 rack/tray/明确工位。
5. **零穿插零悬空：PASS（几何基线）**。v4 静态审计与运行时接触证据为器材间最小分离 0.25–0.40 mm、静置最大位移 0.0005 mm；新场景复制布局后必须重新跑同一审计，不能继承 PASS。

当前整体与三站图仍保留“教学实验室式空台面”的差距：overviews 显示大窗、蓝色柜体和宽通道，A/C 只占岛台局部；这既降低 A-Lab 密集工业感，也造成远端目标不可达。修法是每个工作流单独成场景、机器人居中、仪器围弧排列，先满足环带，再应用三排对齐，释放的空台面用于 wf03/wf04/wf05 的真实器材，而不是继续把设备沿 4 m 直台面拉开。

### 第 15 轮展示待命姿态复核

最终整体/三站静帧已在展示副本写入弯肘待命姿态后重渲（`standby_rerun2.log`，同一 84 张索引中的 overview_1、overview_2、station_a/b/c 已更新）。抽检结果：A 的 FR3 肩部转向前方、肘部折起、指垫落在转盘/前作业区上方；B 的 UR5e 肩部转向炉排/导轨侧、肘部折起、指垫在装载架前方；C 的 UR5e 肩部转向 XRD/瓶架作业区、肘部折起。展示姿态只为表达尺度和作业方向，不能替代真实 TCP 可达/碰撞验收。

第一轮零位姿图已被保留在运行日志的 SHA/时间记录中，但不作为最终保真证据。若新场景改变基座或工作中心，需按各场景目标群重新求解待命姿态；禁止复制同一组关节角。
