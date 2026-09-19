# Reconstruction report: wf05_reagent_logistics_safety

Status: **ok**  env: isaacsim51  cameras_ok: True

Built with the generic recon kit (derived from the wf01 GPT-6 Astra build); no model calls.

| prim | asset | status | scale | robot xy | changes |
|---|---|---|---|---|---|
| /World/Stations/cabinet_1 | art:ReagentCabinet001 | placed | 0.20 | 0.63, 0.20 | Uniform scale 0.200 to fit the bench footprint/height budget |
| /World/Stations/dispenser_1 | art:BottleTopDispenser002 | placed | 1.00 | 0.55, -0.02 | Source lacks joints or a native ArticulationRootAPI: treated as a rigid instrument (door/lid not actuable); Consolidated |
| /World/Stations/balance_1 | art:AnalyticalBalance001 | placed | 0.58 | 0.58, -0.30 | Source lacks joints or a native ArticulationRootAPI: treated as a rigid instrument (door/lid not actuable); Uniform scal |
| /World/Stations/rack_1 | Test_Tube_Rack | placed | 0.91 | 0.30, 0.33 | Uniform scale 0.913 to fit the bench footprint/height budget; Consolidated source parts into one root rigid body; native |
| /World/Stations/waste_1 | glass_beaker_500ml | placed | 1.00 | 0.23, -0.32 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/bottle_acid | brown_reagent_bottle_large | placed | 1.00 | 0.74, 0.25 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/beaker_1 | glass_beaker_100ml | placed | 1.00 | 0.40, 0.20 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/crucible_used | Crucible | placed | 1.00 | 0.35, -0.15 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/tube_used | glass_test_tube_20ml | placed | 1.00 | 0.25, 0.26 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/tongs_1 | Crucible_Tong | placed | 1.00 | 0.25, -0.10 | Consolidated source parts into one root rigid body; native collision meshes retained |

## Articulation joints
- `/World/Stations/cabinet_1`: Door002_joint, Door001_joint, ReagentCabinet001_002_joint, Door003_joint, Door004_joint, Prop002_joint, Prop001_joint

Layout moves: 7

Launch: `bash recon/launch.sh build_scene.py --batch all --steps 60`
