正式协议边界检查：当前有 **3 项正式前需要修复的缺口**。正式 60 试验尚未开始；以下来自代码和内存合成复现，不表示已有正式数据受污染。仅检查指定协议边界，没有修改主模块、候选代码、helper 或真实数据。

1. **P1 — 失败试验不能稳定保留 required 20/60 分母，空轨迹还会中断整次汇总。** [candidate_07/twin_demo.py:1233](/data/liyufeng/goai_workflows/alab_twin_collect/diagnostics/candidate_07/twin_demo.py:1233) 仅在 `rec.tick>0` 时保存 raw/meta；[finalize_dataset.py:26](/data/liyufeng/goai_workflows/alab_twin_collect/finalize_dataset.py:26) 静默跳过没有 meta 的已创建试验目录，[第 68 行](/data/liyufeng/goai_workflows/alab_twin_collect/finalize_dataset.py:68) 又以已读取数量作成功率分母。复现建立 60 个 attempted contract，其中 A trial19 无 meta：最终只有 **59 行，A=19/19=100%**。代码确实标记 `all_60_required_trials_present=false`，但这不能替代 required20 分母。再直接保存 `t=[]` 的合法空记录，复核器 [第 41 行](/data/liyufeng/goai_workflows/alab_twin_collect/diagnostics/candidate_07/trajectory_audit.py:41) 返回精简失败结果，finalizer [第 39 行](/data/liyufeng/goai_workflows/alab_twin_collect/finalize_dataset.py:39) 因缺少 `penetration_numerical_tolerance_m` 抛 `KeyError`。最小修复是为每个 attempted trial 保存失败 meta/rawempty 标记，以 required identities 汇总，每站成功率固定除以20；缺失/空证据保留为失败并且不终止其他试验汇总。复现键：`attempt_without_meta`、`empty_raw_failure`。

2. **P1 — 复用 destination 会产生新索引与旧打包证据不一致。** [finalize_dataset.py:55](/data/liyufeng/goai_workflows/alab_twin_collect/finalize_dataset.py:55) 在 steps 字节相同的现有 episode 上只刷新 `independent_audit.json`，不刷新 meta、请求/观察记录或视频；[第 99 行](/data/liyufeng/goai_workflows/alab_twin_collect/finalize_dataset.py:99) 从 destination 旧文件选 representative。复现同路径重新汇总后，**index calls=2、aborted=true；包内 meta calls=1、aborted=null**；当前 source 已无视频，但旧代表视频仍保留。最小修复是完整刷新或严格比较整个证据包后拒绝不一致复用，并重新建立带 source episode provenance 的代表视频选择；无选中视频时不能遗留旧 representative。复现键：`rerun_export_freshness`。

3. **P2 — 缺失 usage 仍输出数值 0 均值。** [candidate_07/collection_protocol.py:262](/data/liyufeng/goai_workflows/alab_twin_collect/diagnostics/candidate_07/collection_protocol.py:262) 初始化 token 总数为0，[第 295 行](/data/liyufeng/goai_workflows/alab_twin_collect/diagnostics/candidate_07/collection_protocol.py:295) 和 [第 319 行](/data/liyufeng/goai_workflows/alab_twin_collect/diagnostics/candidate_07/collection_protocol.py:319) 将缺失 usage 加作0；[finalize_dataset.py:71](/data/liyufeng/goai_workflows/alab_twin_collect/finalize_dataset.py:71) 据此算均值。一次失败请求且 `usage=None` 的复现得到 **mean_reported_tokens_in/out=0/0、calls_without_usage=1**。现有 [第 81 行](/data/liyufeng/goai_workflows/alab_twin_collect/finalize_dataset.py:81) 已明确说明这是下界，报告没有隐瞒该限定；但按本次“缺失 usage 不得表示零费用均值”的严格要求，实际 token/费用均值应为 null/unknown，已知子总数或下界另列。复现键：`all_usage_missing`。

旧 root scorer 的接线差异是主线程确认的冻结期间待应用状态，**不列为第四个未修 bug**。[finalizer 第 11 行](/data/liyufeng/goai_workflows/alab_twin_collect/finalize_dataset.py:11) 当前加载根目录旧 scorer；合成 `q_all` 越界、`qd_all` 超速或缺失 `q_all` 时旧 scorer 均通过，而 candidate_07 的 [完整关节检查](/data/liyufeng/goai_workflows/alab_twin_collect/diagnostics/candidate_07/trajectory_audit.py:129) 均拒绝。`apply_candidate07` 后必须通过 finalizer 的实际导入路径重做这三项确认。

在本次边界内未发现严重缺口的控制项：请求计数在 ask 前递增、finally 保留失败请求；`effort='medium'`；C 两阶段共享唯一 `range(min(budget,20))`；有 meta 的正常失败留分母；诊断排除；精确 digest 重复留分母但不计合格。预算和 C 控制流只作静态检查，未调用请求传输；去重结论只覆盖精确 digest，未宣称语义去重。

复现命令：

```bash
PYTHONDONTWRITEBYTECODE=1 bash usd_python.sh geometry_audit/formal_protocol_readiness_check.py --expect-green
```

当前返回 **exit 1（RED）**：分母丢失、空记录崩溃、未知 usage 数值零、导出 meta 不一致四个断言为真，归于上面三项缺口。去掉 `--expect-green` 可只生成证据。修复时可用同一检查器核对行为；其中 finalizer 的 Path/copy/审核结果是内存替身，用于检验汇总逻辑，未触碰任何真实 episode 或 destination。

[复现脚本](formal_protocol_readiness_check.py) · [证据 JSON](formal_protocol_readiness.json)。JSON 绑定所有被读源文件 SHA-256，运行期间源文件均未变化。报告和检查脚本是本次唯一持久化输出。
