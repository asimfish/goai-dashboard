# v4 Isaac RTX 渲染结果与相机修正（claude 直接执行，2026-09-13 21:5x）

背景：5090 agent 的消息队列积压五条指导（最早一条 acked 未送达 4 小时），关键路径停滞，故由我在
`/data/liyufeng/goai_workflows/alab_twin/v4render/` 直接加载 layout_v4 出渲染。**只渲染，不采集，不写 agent 的任何目录。**

## 结果
15 路相机全部渲出有效画面（像素标准差 50–77，空白画面约为 2）。材质、光照、阴影、金属反射、玻璃透明均正常。
产物：`v4render/cam_*.png`、`render_check.json`、日志 `render_v4b.log`。

## 修正的三处问题
1. **四路 corner 全景相机渲成纯白墙**（均值 236–240、标准差 2.2–3.5）。眼点是旧 lab_clean 房间的四角
   (±4.5, ±3.5)，在 Scene02 墙外。已换成两路房间内总览：
   overview_1 eye (3.4, 2.2, 2.90) → target (−1.2, −2.2, 1.10) focal 14；
   overview_2 eye (−3.6, 0.8, 2.90) → target (1.8, −2.2, 1.10) focal 14。
2. **B 站四路相机对准炉排中心 (−2.15, −2.5)**，而作业组合是 ur5e_B (−1.385, −1.805)、furnace_4 (−1.26, −2.885)、
   crucible_rack_1/2 (−0.7, −2.4)/(−0.9, −2.25)，机械臂被挤到画面边缘。已改为对准作业区质心 (−1.06, −2.30)，
   另加一路 b_row 交代四炉全排。新参数见 `cameras_fixed_v4.json`。
3. **加载错误**：v4 仪器只暴露 `Door_joint`，而 scene_cfg_twin 的 articulated 资产配了两个执行器组
   （`Door.*|Lid.*|Cover.*` 与 `^(?!Door|Lid|Cover).*`），后者匹配为空 → Isaac Lab 抛
   `ValueError: Not all regular expressions are matched`，六台铰链设备 `_initialize_impl` 全部失败。
   已把执行器组收敛为单组 `.*`（stiffness 200 / damping 20）。**5090 与 4090 在自己的副本里都要做同样修正。**

## 一并量出的摆放实情（不掩盖）
导轨座在仿真里固定停在 furnace_4 前，四台炉到 ur5e_B 基座的水平距离：
furnace_4 1.087 m / furnace_3 1.290 m / furnace_2 1.877 m / furnace_1 2.600 m。
UR5e 臂展约 0.85 m，按炉口算 furnace_4 约 0.79 m（贴近极限），其余三台在导轨不动的前提下不可作业。
论文中 R2 沿导轨移动逐台装载，这是孪生与真实 A-Lab 的已知差异。

## 相机几何独立复核（另一份，见 camera_review.txt）
12 路正式相机的眼点都在房间内、不在任何已放置物体的包围盒内部、不超天花板 3.338 m、瞄点都对着本站机器人
基座（阈值 1.2 m），水平视场 53–90°，主体距离 1.6–3.3 m。
