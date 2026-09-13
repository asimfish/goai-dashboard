# Reconstruction report: wf02_powder_recovery_xrd

Status: **ok**  env: isaacsim51  cameras_ok: True

Built with the generic recon kit (derived from the wf01 GPT-6 Astra build); no model calls.

| prim | asset | status | scale | robot xy | changes |
|---|---|---|---|---|---|
| /World/Stations/balance_1 | art:AnalyticalBalance001 | placed | 0.58 | 0.52, 0.30 | Source lacks joints or a native ArticulationRootAPI: treated as a rigid instrument (door/lid not actuable); Uniform scal |
| /World/Stations/grinder_1 | mortar | placed | 1.00 | 0.50, 0.00 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Stations/prep_1 | Funnel_Stand | placed | 0.42 | 0.45, -0.30 | Uniform scale 0.424 to fit the bench footprint/height budget; Consolidated source parts into one root rigid body; native |
| /World/Stations/xrd_1 | art:PHMeterAcidimeter001 | placed | 0.76 | 0.70, -0.26 | Source lacks joints or a native ArticulationRootAPI: treated as a rigid instrument (door/lid not actuable); Uniform scal |
| /World/Stations/rack_1 | Test_Tube_Rack | placed | 0.91 | 0.30, 0.33 | Uniform scale 0.913 to fit the bench footprint/height budget; Consolidated source parts into one root rigid body; native |
| /World/Stations/waste_1 | glass_beaker_500ml | placed | 1.00 | 0.23, -0.32 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/crucible_s1 | Crucible | placed | 1.00 | 0.35, 0.20 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/pestle_1 | pestle | placed | 1.00 | 0.44, 0.08 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/funnel_1 | Funnel | placed | 1.00 | 0.48, -0.21 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/vial_s1 | Sample_Tube_With_Stopper | placed | 1.00 | 0.25, 0.26 | Consolidated source parts into one root rigid body; native collision meshes retained |
| /World/Objects/holder_1 | weighing_paper | placed | 1.00 | 0.36, -0.17 | Removed PhysxDeformableBodyAPI (rigid overlay); Removed PhysxDeformableBodyMaterialAPI (rigid overlay); Consolidated sou |
| /World/Objects/disc_1 | None | created | 1.00 | 0.54, -0.11 | Created 40 x 40 x 6 mm acrylic flattening disc (box collider; a thin cylinder sank 15 mm into the bench) |

Layout moves: 9

Launch: `bash recon/launch.sh build_scene.py --batch all --steps 60`
