# phase-batch 核对表 · 面板动作按阶段切割

核对时间 2026-09-20T05:43:32+08:00 · 工具 `/data/liyufeng/goai_workflows/_shared/tools/panel_media/cut_phases.py`（--poster-format jpg --no-views）· 输出根 `/mnt/nas/data/lyf/goai/subop_store/claude/panel_media/actions` · 总表 `INDEX.json`

组数 34（基础 18 + A 站两段 16）· OK 34 · 有问题 0 · 合计 303.8 MB

判定：每条 clip `frames_written == frames_expected`（ffprobe 数帧）、video_full 存在、阶段数 = 阶段文件条数、无 skipped（不足一帧者单列）、runner rc=0、manifest all_ok。
「末帧裁 1 帧」= 该段 end_tick 是 run 最后一个 tick，ceil 后比视频多 1 帧，工具按流长裁掉（manifest `clamped`），非缺帧。

| 组 | 父 run | 阶段 | clips OK | video_full 帧 写/期 | 大小 | 结果 |
|---|---|---|---|---|---|---|
| A-precursor_1__20260916T151316 | 20260916T151316 | 6 | 6/6 | 623/623 | 11.8 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_6_A-08_release_retreat.mp4 |
| A-precursor_1__20260917T171703 | 20260917T171703 | 6 | 6/6 | 719/719 | 16.0 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_6_A-32_release_retreat.mp4 |
| A-precursor_1__20260918T072411 | 20260918T072411 | 6 | 6/6 | 732/732 | 13.0 MB | OK |
| A-precursor_2__20260916T182536 | 20260916T182536 | 6 | 6/6 | 623/623 | 10.6 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_6_A-14_release_retreat.mp4 |
| A-precursor_2__20260918T072411 | 20260918T072411 | 6 | 6/6 | 732/732 | 13.0 MB | OK |
| A-precursor_3__20260917T114323 | 20260917T114323 | 6 | 6/6 | 792/792 | 12.6 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_6_A-20_release_retreat.mp4 |
| A-precursor_3__20260918T072411 | 20260918T072411 | 6 | 6/6 | 862/862 | 15.1 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_6_A-50_release_retreat.mp4 |
| A-precursor_4 | 20260917T111602 | 6 | 6/6 | 792/792 | 12.7 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_6_A-26_release_retreat.mp4 |
| B-tray_load | 20260916T122918 | 6 | 6/6 | 879/879 | 17.8 MB | OK · 门由电机开（旧） |
| C-vial_balance | 20260917T114326 | 6 | 6/6 | 786/786 | 15.8 MB | OK |
| C-vial_1 | 20260916T173540 | 6 | 6/6 | 457/457 | 10.3 MB | OK |
| C-holder_load | 20260916T173540 | 7 | 7/7 | 720/720 | 16.0 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_7_C-13_close_window.mp4 |
| MOTOR__20260917T091215 | 20260917T091215 | 4 | 4/4 | 217/217 | 3.5 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_4_MOTOR-I051-04_hold_close.mp4 |
| MOTOR__20260917T092300 | 20260917T092300 | 8 | 8/8 | 432/432 | 8.3 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_8_MOTOR-I028-08_hold_close.mp4 |
| MOTOR__20260917T093239 | 20260917T093239 | 4 | 4/4 | 216/216 | 4.1 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_4_MOTOR-I001-04_hold_close.mp4 · 门由电机开（旧） |
| MOTOR__20260917T094846 | 20260917T094846 | 4 | 4/4 | 216/216 | 4.1 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_4_MOTOR-I004-04_hold_close.mp4 · 门由电机开（旧） |
| MOTOR__20260917T095037 | 20260917T095037 | 8 | 8/8 | 432/432 | 8.4 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_8_MOTOR-I010-08_hold_close.mp4 · 门由电机开（旧） |
| MOTOR__20260917T100505 | 20260917T100505 | 4 | 4/4 | 216/216 | 4.2 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_4_MOTOR-I007-04_hold_close.mp4 · 门由电机开（旧） |
| A-precursor_1__20260916T151316__part1_dose | 20260916T151316 | 4 | 4/4 | 433/433 | 8.3 MB | OK |
| A-precursor_1__20260916T151316__part2_return | 20260916T151316 | 3 | 3/3 | 191/191 | 3.7 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_3_A-08_release_retreat.mp4 |
| A-precursor_1__20260917T171703__part1_dose | 20260917T171703 | 4 | 4/4 | 480/480 | 10.9 MB | OK |
| A-precursor_1__20260917T171703__part2_return | 20260917T171703 | 3 | 3/3 | 239/239 | 5.4 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_3_A-32_release_retreat.mp4 |
| A-precursor_1__20260918T072411__part1_dose | 20260918T072411 | 4 | 4/4 | 480/480 | 8.7 MB | OK |
| A-precursor_1__20260918T072411__part2_return | 20260918T072411 | 3 | 3/3 | 252/252 | 4.5 MB | OK |
| A-precursor_2__20260916T182536__part1_dose | 20260916T182536 | 4 | 4/4 | 432/432 | 7.3 MB | OK |
| A-precursor_2__20260916T182536__part2_return | 20260916T182536 | 3 | 3/3 | 191/191 | 3.4 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_3_A-14_release_retreat.mp4 |
| A-precursor_2__20260918T072411__part1_dose | 20260918T072411 | 4 | 4/4 | 480/480 | 8.7 MB | OK |
| A-precursor_2__20260918T072411__part2_return | 20260918T072411 | 3 | 3/3 | 252/252 | 4.6 MB | OK |
| A-precursor_3__20260917T114323__part1_dose | 20260917T114323 | 4 | 4/4 | 504/504 | 8.2 MB | OK |
| A-precursor_3__20260917T114323__part2_return | 20260917T114323 | 3 | 3/3 | 288/288 | 4.7 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_3_A-20_release_retreat.mp4 |
| A-precursor_3__20260918T072411__part1_dose | 20260918T072411 | 4 | 4/4 | 563/563 | 10.1 MB | OK |
| A-precursor_3__20260918T072411__part2_return | 20260918T072411 | 3 | 3/3 | 300/300 | 5.3 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_3_A-50_release_retreat.mp4 |
| A-precursor_4__part1_dose | 20260917T111602 | 4 | 4/4 | 504/504 | 8.2 MB | OK |
| A-precursor_4__part2_return | 20260917T111602 | 3 | 3/3 | 288/288 | 4.7 MB | OK · 末帧裁 1 帧: video_full.mp4,phase_3_A-26_release_retreat.mp4 |

## 跳过（已由监督切好，本批不重复）

- SUBOP-C-20 → C-capper：`/mnt/nas/data/lyf/goai/subop_store/claude/panel_media/SUBOP-C-20`
- SUBOP-B-10 → B-tray_load_release：`/mnt/nas/data/lyf/goai/subop_store/claude/panel_media/SUBOP-B-10`（门由电机开（旧））
- SUBOP-C-21 → C-xrd_window：`/mnt/nas/data/lyf/goai/subop_store/claude/panel_media/SUBOP-C-21_full`

## 无登记段的面板动作（无可切视频）

- A-stock, A-paper, A-mortar, B-tray_unload, B-rail_furnace, B-rail_park, B-handover, C-shaker, C-uncap, C-prep, C-recap, C-store, C-holder_prep, C-holder_store

## A 站两段拆分

规则与逐组 tick 见 `A_two_part/GROUPING.md`；needs_review 组：无

## 门注记（D29）

B-tray_load 与 MOTOR 炉门组（furnace_1..4）在 INDEX.json 里带 `door_note_cn: 门由电机开（旧）`；SUBOP-B-10（tray_load_release，已切）同样适用。
