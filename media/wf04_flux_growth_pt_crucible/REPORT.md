# Reconstruction report: wf04_flux_growth_pt_crucible

Status: **ok**  env: isaacsim51  cameras_ok: True

Built with the generic recon kit (derived from the wf01 GPT-6 Astra build); no model calls.

| prim | asset | status | scale | robot xy | changes |
|---|---|---|---|---|---|
| /World/Stations/dosing_1 | Precision_Electronic_Balance | placed | 0.82 | 0.54, 0.29 | Uniform scale 0.817 to fit the bench footprint/height budget; Consolidated source parts into one root rigid body; native |
| /World/Stations/furnace_1 | art:Oven065 | placed | 0.24 | 0.66, -0.27 | Uniform scale 0.240 to fit the bench footprint/height budget |
| /World/Stations/leach_1 | art:MagneticStirrer001 | placed | 0.65 | 0.55, 0.05 | Source lacks joints or a native ArticulationRootAPI: treated as a rigid instrument (door/lid not actuable); Uniform scal |
| /World/Stations/filter_1 | Funnel_Stand | placed | 0.42 | 0.45, -0.30 | Uniform scale 0.424 to fit the bench footprint/height budget; Consolidated source parts into one root rigid body; native |
| /World/Stations/rack_1 | Test_Tube_Rack | placed | 0.91 | 0.30, 0.33 | Uniform scale 0.913 to fit the bench footprint/height budget; Consolidated source parts into one root rigid body; native |
| /World/Objects/bottle_premix | clear_reagent_bottle_small | placed | 1.00 | 0.24, 0.14 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/bottle_flux | brown_reagent_bottle_large | placed | 1.00 | 0.35, 0.24 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/bottle_water | clear_reagent_bottle_large | placed | 1.00 | 0.26, 0.23 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/paper_1 | weighing_paper | placed | 1.00 | 0.71, 0.30 | Removed PhysxDeformableBodyAPI (rigid overlay); Removed PhysxDeformableBodyMaterialAPI (rigid overlay); Consolidated sou |
| /World/Objects/pt_crucible_1 | Crucible | placed | 1.00 | 0.39, 0.11 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/tray_1 | None | created | 1.00 | 0.38, -0.21 | Created 130 x 100 x 6 mm tray with a 54 mm raised handle |
| /World/Objects/tongs_1 | Crucible_Tong | placed | 1.00 | 0.25, -0.10 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/beaker_1 | glass_beaker_250ml | placed | 1.00 | 0.71, 0.05 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/funnel_1 | Funnel | placed | 1.00 | 0.53, -0.10 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/flask_1 | erlenmeyer_flask | placed | 1.00 | 0.25, -0.26 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/vial_s1 | Sample_Tube_With_Stopper | placed | 1.00 | 0.20, 0.25 | Consolidated source parts into one root rigid body; native collision meshes retained |

## Articulation joints
- `/World/Stations/furnace_1`: Button001_joint, Button002_joint, Button003_joint, Switch_joint, Knob_joint, Button004_joint, Door_joint

Layout moves: 13

Launch: `bash recon/launch.sh build_scene.py --batch all --steps 60`
