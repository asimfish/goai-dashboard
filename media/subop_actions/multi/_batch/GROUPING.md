# A 站两段拆分（D30 d）· 规则与逐动作拆分

生成：phase-batch make_groups.py · 输入 /mnt/nas/data/lyf/goai/subop_store/claude/panel_media/actions/_batch/segments_local.json · 拆分事件 `leave_balance`

## 规则

登记的 A 站 6 段是 阶段 3 预接近 → 4 接近闭爪 → 5 夹持提离 → 6 携行（stages = lifted, above_balance, dosing, above_source）→ 7 对准下放 → 8 释放撤离。
阶段 6 一段之内既有去投料位也有回源位，所以仅按段边界拆不出两条独立动作；拆分点取父 run `meta.json → metrics.events` 里脚本专家的路点到位 tick：
`lift → raise_clearance → over_balance → turn_above_balance → dosing（保持 2 s）→ leave_balance → restore_grasp_yaw → over_source → return → retreat`。

- **投料取出（part1_dose）** = 阶段 3、4、5 全段 + 阶段 6 前半 `[lifted, leave_balance 到位)`：含到达投料位、保持 2 s、抬离投料位。
- **归位（part2_return）** = 阶段 6 后半 `[leave_balance 到位, above_source)`（restore_grasp_yaw → over_source）+ 阶段 7、8 全段。
- 两部分在 `leave_balance` 到位 tick 处首尾相接；父视频 12 fps，tick 不落在帧边界时按工具规则前一段向上取整、后一段向下取整（最多 1 帧重叠）。
- 任一组缺 `leave_balance` tick、阶段序列不是 [3,4,5,6,7,8] 或 tick 不在阶段 6 区间内 → `needs_review: true`，不猜。

## 逐动作拆分

| 组 | 父 run | dt | 阶段 6 区间 | leave_balance tick (s) | part1 tick 区间 | part2 tick 区间 | needs_review |
|---|---|---|---|---|---|---|---|
| A-precursor_1__20260916T151316 | 20260916T151316 | 1/60 | 1141–2941 | 2461 (41.02) | [300, 2461) = 5.00–41.02 s | [2461, 3417) = 41.02–56.95 s | no |
| A-precursor_1__20260917T171703 | 20260917T171703 | 1/240 | 4560–12720 | 10800 (45.00) | [1200, 10800) = 5.00–45.00 s | [10800, 15583) = 45.00–64.93 s | no |
| A-precursor_1__20260918T072411 | 20260918T072411 | 1/240 | 4560–12720 | 10800 (45.00) | [1200, 10800) = 5.00–45.00 s | [10800, 15840) = 45.00–66.00 s | no |
| A-precursor_2__20260916T182536 | 20260916T182536 | 1/240 | 4560–11760 | 9840 (41.00) | [1200, 9840) = 5.00–41.00 s | [9840, 13668) = 41.00–56.95 s | no |
| A-precursor_2__20260918T072411 | 20260918T072411 | 1/240 | 4560–12720 | 10800 (45.00) | [1200, 10800) = 5.00–45.00 s | [10800, 15840) = 45.00–66.00 s | no |
| A-precursor_3__20260917T114323 | 20260917T114323 | 1/60 | 1500–3300 | 2820 (47.00) | [300, 2820) = 5.00–47.00 s | [2820, 4262) = 47.00–71.03 s | no |
| A-precursor_3__20260918T072411 | 20260918T072411 | 1/240 | 6214–14374 | 12454 (51.89) | [1200, 12454) = 5.00–51.89 s | [12454, 18454) = 51.89–76.89 s | no |
| A-precursor_4 | 20260917T111602 | 1/60 | 1500–3300 | 2820 (47.00) | [300, 2820) = 5.00–47.00 s | [2820, 4263) = 47.00–71.05 s | no |

## 路点到位 tick（meta.metrics.events）

- A-precursor_1__20260916T151316: pregrasp_hover=601, grasp_arrival=841, lift=1141, raise_clearance=1381, over_balance=1621, turn_above_balance=1861, dosing=2101, leave_balance=2461, restore_grasp_yaw=2701, over_source=2941, return=3117, retreat=3357
- A-precursor_1__20260917T171703: pregrasp_hover=2400, grasp_arrival=3360, lift=4560, raise_clearance=5520, over_balance=6480, turn_above_balance=7440, dosing=9360, leave_balance=10800, restore_grasp_yaw=11760, over_source=12720, return=13423, retreat=14383
- A-precursor_1__20260918T072411: pregrasp_hover=2400, grasp_arrival=3360, lift=4560, raise_clearance=5520, over_balance=6480, turn_above_balance=7440, dosing=9360, leave_balance=10800, restore_grasp_yaw=11760, over_source=12720, return=13680, retreat=14640
- A-precursor_2__20260916T182536: pregrasp_hover=2400, grasp_arrival=3360, lift=4560, raise_clearance=5520, over_balance=6480, turn_above_balance=7440, dosing=8400, leave_balance=9840, restore_grasp_yaw=10800, over_source=11760, return=12468, retreat=13428
- A-precursor_2__20260918T072411: pregrasp_hover=2400, grasp_arrival=3360, lift=4560, raise_clearance=5520, over_balance=6480, turn_above_balance=7440, dosing=9360, leave_balance=10800, restore_grasp_yaw=11760, over_source=12720, return=13680, retreat=14640
- A-precursor_3__20260917T114323: pregrasp_hover=600, grasp_arrival=1080, lift=1500, raise_clearance=1740, over_balance=1980, turn_above_balance=2220, dosing=2460, leave_balance=2820, restore_grasp_yaw=3060, over_source=3300, return=3716, retreat=3956
- A-precursor_3__20260918T072411: pregrasp_hover=2614, grasp_arrival=4534, lift=6214, raise_clearance=7174, over_balance=8134, turn_above_balance=9094, dosing=11014, leave_balance=12454, restore_grasp_yaw=13414, over_source=14374, return=16294, retreat=17254
- A-precursor_4: pregrasp_hover=600, grasp_arrival=1080, lift=1500, raise_clearance=1740, over_balance=1980, turn_above_balance=2220, dosing=2460, leave_balance=2820, restore_grasp_yaw=3060, over_source=3300, return=3717, retreat=3957

part1 阶段 = `<seg3>`, `<seg4>`, `<seg5>`, `<seg6>a_carry_to_dose`；part2 阶段 = `<seg6>b_carry_back`, `<seg7>`, `<seg8>`。每部分目录里 `subop_phases.json` 带 `group_label_cn`（投料取出 / 归位）、`split_tick`、`split_evidence`、`markers`。
