此目录可直接作为 GitHub Pages 的 viewer/ 内容发布。所有运行时资源来自同一站点。

默认打开 index.html：播放现有 A 站局部抓取诊断；下拉框切换五个独立工作流静态几何。
可用暂停、时间轴、倍速和循环。剖开房间顶部只是浏览器裁切，没有修改几何或状态。

实时模式：?ws=ws://SIM_HOST:8766&identity_digest=REAL_SIM_IDENTITY_DIGEST&geometry=layout_v4_textured_draco.glb
实时 sim 必须用该 GLB 的真实 geometry_sha256；身份或几何不符直接拒绝。公开 Pages 默认回放，不自动连接任何本地 socket。

当前 replay/frames.bin：648 帧 × 992 B，30 Hz，13 个 FR3 link + 19 个物体。其他实体使用 USD authored_pose_w 静态位置，不补造未记录运动。
数据来自 A100 真仿真，抓取前验证双侧冲量，搬运模式 kinematic_after_verified_grasp；是抬升与原位放回的诊断，不是完整 t_dose / G3 / 连续摩擦搬运。
当前 bundle 没有 B 空跑、五场景成功采集或新仿真性能声明。

更新轨迹：使用配套 tools/export_replay.py。输入 steps.npz、meta.json（或原始 metrics.json）、该次运行的真实 checkpoint 或轻量 source-manifest，以及匹配的 geometry.json。
source-manifest 只需 identity（沿用 checkpoint 身份字段）、robot_prim、object_prims（对象名到 prim 路径）、carry_mode；无需新起仿真去制作完整 checkpoint。
身体顺序来自 metrics.all_body_names。源文件不存在记录的名字、帧长度不对、身份不符、时间不连续均拒绝；不能猜关节/link 顺序或沿用旧场景身份。
导出器直接调用 live_stream.TransformStream.encode；新轨迹写到新目录，核验后替换 replay 文件。工具保守标为诊断，不自动宣称任务验收成功。

例：python3 tools/export_replay.py --steps EP/steps.npz --metrics EP/meta.json --source-manifest EP/source_identity.json --geometry layout_v4_textured_draco.geometry.json --output replay
本地预览：python3 -m http.server 8080，浏览器打开 http://localhost:8080/。

浏览器测试使用 SwiftShader，约 0.8–2.6 fps 的显示测量是软件渲染结果，不能当作真实 GPU 帧率。
