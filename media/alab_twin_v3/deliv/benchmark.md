# A-Lab 5090 physical collection benchmark

Updated: 2026-09-13T09:40:01.534950+08:00

Required 60-trial set complete: **False**. Duplicates: 0.

| Station | Trials | Qualified | Success rate | Stages 0/1/2/3/4 | Mean calls | Mean reported tokens in/out | Mean wall s |
|---|---:|---:|---:|---|---:|---|---:|
| A | 20 | 11 | 55.0% | 8/0/0/1/11 | 12.05 | not measured/not measured | 323.34 |
| B | 0 | 0 | not measured | 0/0/0/0/0 | not measured | not measured/not measured | not measured |
| C | 0 | 0 | not measured | 0/0/0/0/0 | not measured | not measured/not measured | not measured |

All selected formal trials remain in the denominator. Diagnostics are excluded; duplicate traces remain reviewable and cannot qualify.

Scores are independently recomputed from steps.npz and raw contact records. Qualifying episodes require physical bilateral grasp evidence, ordered task phases, lift, target operation, stable release within 20 mm, tilt <=0.25 rad, required retreat/door state, and zero penetration ticks. B also checks retained crucibles and final tray yaw.

Formal penetration admission uses zero tolerance: every relevant negative contact separation counts, including finger/object contacts. A secondary count below -1 mm is diagnostic only. Raw separations are preserved. Adjacent and fixed-component assembly pairs are filtered; nonadjacent self-collisions remain enabled. Transport also requires at least 80% bilateral contact coverage and at most 20 mm drift of the object origin relative to the measured TCP. Stage 4 requires all qualification gates; geometric task progress is retained separately.

Station token means require complete usage for every request; a missing usage record makes the affected trial total and station mean unknown. Separate lower-bound sums and missing-usage counts are retained. Required success rates are unavailable until all trial IDs 0..19 occur exactly once.

Confounds: A dosing is a position-and-two-second-dwell proxy without powder dynamics. XRD uses a two-axis engineering door proxy preserving the original collision shape. C holder initial ±20 mm X/Y jitter can place its center outside its 22 mm support puck (11.13% geometric area fraction); resulting failures stay in the denominator. B uses an upper handle contact band with angled pad edge contact. The eight task objects inherit a generic 0.15 kg mass each (loaded B tray 0.75 kg), without physical mass calibration. CPU collision prediction is sampled and assumes rigid carriage of the held object; actual contact and pose traces control admission.

Observation calibration confound: 4 episodes originally reported an FR3 gap approximately 14.969 mm too large to the planner. Their original arrays and decision inputs are preserved. Independent release scoring reconstructs the true gap from measured rigid-body poses and pad vertices; post-hoc calibration does not change what the planner saw. See each observation_calibration.json.

Operator scheduling confound: 1 episodes include an instrumented pause to request a stop after the current episode; no physical commands were inserted. The affected trial also recorded 9 SSL failures, whose root cause is unproven. Failed requests count toward the 20-call limit and absent token usage remains unknown.

Robot reach acceptance is reported separately in reach_after.json. See evidence/ for source geometry, runtime diagnostics and calibration.
