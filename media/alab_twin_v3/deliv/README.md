# T400 执行器证据与差异移交（CPU 整理，不启动新运行）

接管方应将这些文件视为诊断证据和代码候选，不是已经实现真实抓持/入炉/入 XRD 的采集器。原始 recon、原资产未修改；本任务没有启动 GPU 或 API。父任务负责部署和 T364 结案。

## 代码身份与 diff

基线：`/home/liyufeng/ops/goai_astra_executor_20260913/input/collection_astra/twin_demo.py`。
取回的工作副本：同目录 `closeout/twin_demo_workcopy.py`。
**两者字节完全相同，SHA-256 均为 `3c44d5ec0c84dd624896179f20040711a6fa9f22266a7d97e379e37efd2e64f4`，零 diff。不能声称主 twin_demo 已修复。**

`diffs/` 中其他文件才是真正候选相对上述基线的 unified diff；`evidence.json.diffs` 对每个 baseline/candidate/diff 都列完整路径和 SHA。这些全量差异描述演进，不能不经审查全部合并。它们保留旧 fr3_C 的硬编码；v3 已换成 ur5e_C，不能直接运行。

- `twin_probe_v16.py`：记录实际 TCP、姿态、关节余量；固定 yaw 与切向双分支探针。
- `twin_counterfactual_probe.py`：碰撞开关反事实诊断，仅用于区分运动学/环境因素，不能作为物理任务成功证据。
- `twin_contact_probe.py`、`twin_camera_probe.py`：接触遥测和相机诊断，不能由零回调推断零碰撞。
- `twin_tcp_probe_v17.py`：UR 开→半闭→闭→重开内侧 pad 采样，以及旧虚拟 TCP 与几何 TCP 对照候选。
- `twin_grasp_probe_v18.py`：诊断入口候选。仍继承 attach/pin 等旧代码；`--no-collect` 与 probe planner 入口限制并不意味着旧采集逻辑已物理化。没有对应完成结果就不能声明它运行通过。

## 从原始数据重算的运行证据

`tangent_C.json` 属于旧 **fr3_C**，不是 v3 ur5e_C。按每目标四条记录的原始顺序（fixed0、fixed90、tangent branch0、branch180），用实际 TCP 误差 ≤10 mm 且姿态误差 ≤0.10 rad 重算：

| 模式 | 实测通过/目标数 | 成功分支最小关节余量 rad |
|---|---:|---:|
| fixed0 | 13/17 | 0.0000759363 |
| fixed90 | 15/17 | 0.00000679493 |
| tangent 任一分支 | 17/17 | 0.00104928 |

完整网格是 12 个角度×3 半径 = **36 点**：16 点被膨胀 AABB 预筛，17 点各有四次 servo 记录，共68条；150° 的三个半径均无记录，原文件没有 `complete` 字段。因此不能写全域17/17或所有目标可达。切向双分支只适用于允许180°对称的物体/抓姿；须记录模型 yaw 与执行 yaw，不可改变非对称物体语义。这些很小的余量不满足例如0.03 rad鲁棒余量门槛。

`baseline_ikprobe_C.json` 的较小腕link位置误差没有姿态/TCP复合验收，不能与上述指标混为一谈。

## 安装高度 CPU 反例（原 results.json 重算）

固定 TCP 在台面上方0.05 m；基座 yaw ±90°；每高度、每模式包括3半径×24全角度×2基座朝向=144目标。使用原USD关节限位、SciPy受限IK；通过门为位置≤2 mm、姿态≤2°，不含碰撞检查。

| 高度 m | 固定俯视 | 切向模180 |
|---|---:|---:|
| 0 | 144/144 | 144/144 |
| 0.20 | 144/144 | 144/144 |
| 0.25 | 143/144 | 144/144 |
| 0.30 | 141/144 | 144/144 |

这次搜索不支持“抬高必然改善低位可达”的结论；固定俯视在0.25/0.30 m反而出现失败。一些通过解关节余量接近0（例如0.20 m固定模式最小4.44e-16 rad）。完整错误、失败目标和各模式余量见 evidence.json.cpu_height。无碰撞路径、可执行轨迹、稳定性都未由这些计数证明。

## 已定位的执行器问题

1. 基线 `Arm._go` 最终只返回 wrist/hand link 的位置误差，丢弃姿态误差；目标link坐标由期望姿态与offset反算，所以当实际姿态偏离时，小link误差不保证实际TCP小误差。需按实际 `tcp()` 计算位置误差，同时检查姿态误差、有限值及关节余量；失败不得 attach 或继续任务。候选v16提供诊断量，不等同整个任务门已修完。
2. 基线 `Recorder.attach/update_kin` 每步写物体根位姿跟随 TCP；`pin/hold_pinned` 每步写释放位姿并清零速度。这是运动学演示机制，不是夹爪接触承载，也不是自然落稳。rubric 会基于 attach/pin 状态加分，不能作为真实采集成功标签。`settle` 清零速度也是干预，应在最终物理采集中删除或明确独立标记。
3. 原注释“腔体convex-solid所以pin”已经不适合作为资产事实。炉、XRD实际腔体/门结构由独立T375/T393等证据处理；应按更新的真实碰撞几何和工程代理机械门执行，不得用pin越过固定窗。
4. UR运行校准（一次张开姿态）记录 wrist-local pad midpoint `[0.0025773675,0.0009566851,0.1263133485] m`，与旧 `[0,0.27,0]` 相差297.230567 mm；内侧几何间隙82.419199 mm。这不是闭合全过程常量，也不是有效接触中心已实测完成。使用内侧真实patch、实际被动关节状态，按张开/半闭/闭合/重开重新校准；不能仅换常量后宣称抓取修复。
5. 首次 contact_probe 为0callbacks，文件明确标 INVALID_CONTACT_PROCESSING_DISABLED_NOT_ZERO_COLLISION_PROOF。随后旧场景 contact_v3_summary 有30/30回调、102539接触点、最小separation −22.954868 mm，不能描述为零接触/零穿模。固定装配碰撞分类另有T397核验；这些旧记录不代表新v3场景运行验收。

## 5090 接管后最小验证顺序

先绑定最终 manifest/asset/scene_cfg/runner SHA，替换旧 fr3_C 硬编码并核实 v3 两UR实际joint/base/TCP映射。启用接触遥测与registry完整性检查；缺回调或缺body映射必须报不可判定。

再做无物体 UR 夹爪闭合TCP探针，记录真实内侧patch中心/间隙、全部关节值和定义差异；FR3使用有效接触区TCP，不能把整个finger视觉AABB质心当TCP。对每类非对称抓姿固定语义，对称物体可显式比较两分支。求解门须同时约束真实TCP位置/姿态、关节余量和求解时限；CPU IK只是候选，运行期仍需连续碰撞、限位、接触/负载验证。

最后逐站做最小物理episode：接触闭合→无位姿写入抬升→保持→移动→释放自然落稳；入炉/XRD还须门驱动实际到位、携带物连续通道净空和末端退出验证。记录完整失败分母；任何阶段使用attach/pin/teleport必须使“真实采集”验收失败。只有这些原始记录完成，才可升级为可采集执行器。

重算命令：`python3 collect_evidence.py`（读取本机明确源路径，仅写本目录）。本包不自动运行任何 probe。

## 本轮修复候选对应表（尚未作为主执行器上线）

路径前缀 `R=/home/liyufeng/ops/goai_astra_executor_20260913`。以下是读取当前候选代码得到的实现意图，不是 GPU 验收结果：

| 建议 | 现有候选 | 参数与剩余验证 |
|---|---|---|
| 两阶段下降：目标上方15 cm悬停，再慢速竖直下降 | `R/servo_core.py:descent_waypoints` | 默认 hover=0.15 m、竖直0.04 m/s；需接管方接入任务，验证悬停和整段携物通道，无碰撞预测不能执行 |
| 使用明确限位与余量的求解策略 | `R/servo_core.py:joint_command`、`R/physical_arm.py:PhysicalArm` | 本轮 DLS λ=0.05、gain=3、关节rate=0.6 rad/s、margin=0.03 rad；初始目标侵入余量会拒绝，不静默跳转。实际关节状态、动力学跟踪与奇异位形仍需验证 |
| 可对照框架或受限数值 IK | `IsaacLab DifferentialIKController` 可选；CPU候选目录 `/home/liyufeng/ops/goai_bounded_ik_20260913/` | 这是接管建议。本轮未验证该框架控制器自带限位能力，不得称其天然 limits-aware；限位、速率、余量、有限值和超时约束需调用方明确实现并测试 |
| 持物失败禁止直接回 HOME | `R/servo_core.py:MotionInterlock`、`R/physical_arm.py:stop/go` | 保持最近已验证关节目标并停止；持物不能home，异常后不得继续。真正安全的持物后退路径必须独立认证；“保持目标”本身也不保证物理不掉落 |
| 按真实 TCP 验收、拒绝未知碰撞预测 | `R/physical_arm.py:tcp/_go` | 终端实际TCP≤10 mm、姿态≤0.10 rad；缺失/未知collision_predictor拒绝运动。UR接近轴、TCP随夹爪变化仍待运行校准 |

本轮未改上述执行器候选，仅补报告与差异索引。它们与历史probe结果不能交叉冒充同一版本的验证。
