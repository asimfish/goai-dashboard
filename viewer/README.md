# A-Lab viewer · 04_surface

本版继承 03_color 的 OmniGlass、WASD、五场景与 v4 诊断回放，补齐 wf01/wf04 天平第二层 OmniSurface 的光学透射。

默认 wf01；?scene=wf01 至 wf05；?scene=replay 为既有 v4 A 站局部诊断。F/按钮切换 Orbit 和自由漫游，WASD 移动、QE 升降、Shift 加速。全部依赖自托管。

OmniGlass 使用 OPAQUE + transmission；OmniSurface 同时存在源 coverage alpha=0.2 与 optical transmission=0.46，两者独立保留。IOR=1.5 来自安装版 OmniSurface.mdl 默认值。不是完整 MDL 体积/散射模型。

本版仅更新 wf01_scene_surface.glb / wf04_scene_surface.glb 的材质 JSON；几何、贴图、实体与位姿原字节保留。其余四个模型沿用 *_color*.glb。实时和回放仍校验身份与几何 SHA。

使用 python3 -m http.server 8080 --bind 127.0.0.1 启动本地预览；不要用 file://。供维护者发布到 viewer/。未自行部署。
