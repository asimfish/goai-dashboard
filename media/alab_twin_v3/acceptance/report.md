# v3 场景验收

B/C 正式采集保持暂停。A 历史20次试验保留11/20合格，不重跑、不改变分母。以下每个PASS仅对应所链接证据中的布局与执行器版本；最终统一版本和G6尚未放行。

| 验收门 | A | B | C | 证据与剩余项 |
|---|---|---|---|---|
| G1 静态及加载后5s | FAIL | FAIL | FAIL | [runtime05静置原始报告](runtime05/G1.json)：pestle5.023mm/18.58°，两UR手部最大1.578°，vial_2为1.092°；接触分离≥−1mm通过。[静态审计](contacts/static_runtime05/result.json)6,925形状/6,713碰撞形状、穿透/不确定0、资源问题0。稳定初态修复待测。 |
| G2 门与入口 | PASS | PASS | PASS | [独立复核](runtime05/G2_independent_review.json)、[六门统计](runtime05/G2_summary.json)、[开状态渲染](runtime05/renders/)。炉门1–4/干燥箱实际50Nm，XRD100N；最大保持误差分别0.0756°/0.00278°/0.00111mm，六门外部接触0；装载托盘、坩埚、单holder三条入口路径外部接触0。T-A投料任务本身不使用门，干燥箱按完整场景范围验收。 |
| G3 脚本专家3/3 | PASS 3/3 | FAIL | FAIL | [A三次独立复核](expert_runs/A_G3_summary.json)：3/3阶段4、负间隙0tick；三次无抖动脚本复位，独立于历史正式集。B已有真实抓持后倾覆失败；C[接触反馈诊断](expert_runs/C_tactile_01/independent_audit.json)阶段2、负间隙86tick、失持，[视频](expert_runs/C_tactile_01/video.mp4)。C新完整路径仅CPU几何通过，不能代替真实摩擦夹持。 |
| G4 完整可达图 | FAIL | FAIL | FAIL | [既有完整216点](../reach_after.json)六项阈值均未过；5cm与20cm双高度、被占格、真实TCP/姿态及UR腕心半径≤0.80m需在最终版本重新测试。 |
| G5 初始视角/遮挡 | PASS | 部分通过 | PASS | [44组独立像素复核](visibility02/G5_independent_review.json)：A瓶3/纸4，C瓶3/holder3无遮挡固定视图；B装载整体2、把手3，各杯至少2。裸托盘轮廓被自身载荷遮挡仍标FAIL，操作对象组合口径留给G6复核。四固定+腕相机PNG均保留；最终布局需复测。 |
| G6 独立放行 | 未通过 | 未通过 | 未通过 | G2/G5已用独立脚本从曲线/原始接触/实例数组重算；G1/G3/G4未过，统一布局/源码指纹放行文件尚不存在。 |

当前C候选还将天平从yaw−90°转到+90°，使真正打开的入口朝向机器人。capper移至(1.45,−2.85)，持瓶先沿西侧绕到x=1.88，再到y=−2.6，沿−X进入称量位。完整CPU路径83段/1,557采样点无非豁免重叠，最小间隙0.580mm；有限采样不构成连续或运行期成功证明。该变更及B空rack_1右移60mm、门角驱动补齐、台面接触偏移1mm均在本地CHANGES.md登记。

G2入口测试按每2mm规定物件位姿进行，包含反向退出；B连同四只坩埚测装载包络。它用于检验入口净空，不是物理抓持数据，未计入G3或正式集。G1以初始化后的首个记录状态开始，Isaac初始化内部可能已步进，不能宣称其before发生在任何物理步进之前；正式统一复核需明确加载基准。

历史失败证据保留：[首次六门跟踪失败](G2_summary.json)、[角驱动修复后仍碰rack_1/台面](runtime04/runtime_report.json)。初版遮挡分析受实例ID动态重分配影响；其零像素结果属于测量失效，已通过逐次保存标签和二值实例图修正，未修改原始图像。

已有采集交付：[benchmark](../benchmark.md)、[A失败分类](../evidence/formal_A/A_failure_classification.md)、[A代表视频](../videos/A_trial007.mp4)、[A归档校验](../archives/station_A_verification.json)。
