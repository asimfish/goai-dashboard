# 门与滑窗操作合同（CPU候选）

以下世界路径对应当前v3。关节开到位是几何插入前提，不代表驱动已经运行通过。

| 器件 | joint 路径 | USD限位 | Isaac打开目标 | 初始驱动建议 |
|---|---|---|---|---|
| furnace_1 | `/World/StationB/furnace_1/model/Oven065_Door/Door_joint` | 0.0..100.0 deg | 1.5 rad（85.9437°） | stiffness 200 / damping 20（沿用scene_cfg_twin_v3的ImplicitActuatorCfg；未调优） |
| furnace_2 | `/World/StationB/furnace_2/model/Oven065_Door/Door_joint` | 0.0..100.0 deg | 1.5 rad（85.9437°） | stiffness 200 / damping 20（沿用scene_cfg_twin_v3的ImplicitActuatorCfg；未调优） |
| furnace_3 | `/World/StationB/furnace_3/model/Oven065_Door/Door_joint` | 0.0..100.0 deg | 1.5 rad（85.9437°） | stiffness 200 / damping 20（沿用scene_cfg_twin_v3的ImplicitActuatorCfg；未调优） |
| furnace_4 | `/World/StationB/furnace_4/model/Oven065_Door/Door_joint` | 0.0..100.0 deg | 1.5 rad（85.9437°） | stiffness 200 / damping 20（沿用scene_cfg_twin_v3的ImplicitActuatorCfg；未调优） |
| XRD滑窗 | `/World/StationC/xrd/Window_slide_joint` | 0.0..0.47999998927116394 stage_length_units | 0.47999998927116394 m | stiffness 2000 / damping 100 / force limit100（现有helper） |
| drying_oven | `/World/StationA/drying_oven/model/Oven065_Door/Door_joint` | 0.0..100.0 deg | 1.5 rad（85.9437°） | stiffness 200 / damping 20（沿用scene_cfg_twin_v3的ImplicitActuatorCfg；未调优） |

建议开到位判据：铰链误差≤0.01 rad且速度≤0.02 rad/s；滑窗误差≤1 mm且速度≤2 mm/s；连续保持0.2 s。门关闭目标为0。增益/容差均是待5090运行验证的初始提案，不能当作硬件参数或已验证控制器。角度命令用Isaac关节target的rad；若直接写USD angular drive，其targetPosition单位为度，禁止混用。

炉/干燥箱USD未写入角驱动增益；表中的200/20来源为已交scene_cfg_twin_v3.py的doors actuator，不凭空补“已验证”扭矩上限。5090必须按实测惯量与接触载荷设置合理力矩限幅。XRD的2000/100/100来自scene_cfg_fragment.py，同样未经运行期调优。

插入载具合同：`operating_targets.json`与`insertion_evidence/results.json`。所有waypoints是物体原点，不是TCP。干燥箱中层搁板顶z=1.1193529101m；XRD样品台顶z=1.3057049302m；底部几何间隙0.8mm。必须由实际抓持变换换算TCP。

XRD只采用当前任务的单个holder_0作为进机载具（明示假设）；16位xrd_holder_rack为机外存放架。整架220mm深大于210mm腔深，背板碰撞证据明确BLOCKED，不能把holder通过解释为整架通过。

先确认门实际开到位再进入；释放后必须验证空夹爪退出，再关闭。CPU载具扫掠不覆盖夹爪、机器人运动及关门后与所放物体的动态接触。
