# Reconstruction report: wf03_wet_chemical_precursor

Status: **ok**  env: isaacsim51  cameras_ok: True

Built with the generic recon kit (derived from the wf01 GPT-6 Astra build); no model calls.

| prim | asset | status | scale | robot xy | changes |
|---|---|---|---|---|---|
| /World/Stations/liquid_1 | art:MagneticStirrer001 | placed | 0.65 | 0.55, 0.10 | Source lacks joints or a native ArticulationRootAPI: treated as a rigid instrument (door/lid not actuable); Uniform scal |
| /World/Stations/ph_1 | art:PHMeterAcidimeter001 | placed | 0.76 | 0.54, -0.25 | Source lacks joints or a native ArticulationRootAPI: treated as a rigid instrument (door/lid not actuable); Uniform scal |
| /World/Stations/mixer_1 | art:HighSpeedCentrifuge001 | placed | 0.46 | 0.64, 0.28 | Source lacks joints or a native ArticulationRootAPI: treated as a rigid instrument (door/lid not actuable); Uniform scal |
| /World/Stations/oven_1 | art:Oven065 | placed | 0.24 | 0.67, -0.26 | Uniform scale 0.240 to fit the bench footprint/height budget |
| /World/Stations/rack_1 | Test_Tube_Rack | placed | 0.91 | 0.30, 0.33 | Uniform scale 0.913 to fit the bench footprint/height budget; Consolidated source parts into one root rigid body; native |
| /World/Stations/waste_1 | glass_beaker_500ml | placed | 1.00 | 0.23, -0.32 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/bottle_nitrate | brown_reagent_bottle_large | placed | 1.00 | 0.25, 0.24 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/bottle_silica | clear_reagent_bottle_large | placed | 1.00 | 0.35, 0.24 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/bottle_ammonia | brown_reagent_bottle_small | placed | 1.00 | 0.46, 0.25 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/cyl_1 | glass_cylinder_100ml | placed | 1.00 | 0.46, 0.34 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/beaker_1 | glass_beaker_250ml | placed | 1.00 | 0.51, -0.01 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/tube_1 | Centrifuge_Tube | placed | 1.00 | 0.23, 0.16 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/dish_1 | glass_beaker_100ml | placed | 1.00 | 0.35, -0.10 | Consolidated source parts into one root rigid body; native collision meshes retained |

## Articulation joints
- `/World/Stations/oven_1`: Button001_joint, Button002_joint, Button003_joint, Switch_joint, Knob_joint, Button004_joint, Door_joint

Layout moves: 11

Launch: `bash recon/launch.sh build_scene.py --batch all --steps 60`
