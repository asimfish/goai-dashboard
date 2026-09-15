import * as THREE from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {DRACOLoader} from './vendor/DRACOLoader.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {FreeFlightControls} from './vendor/FreeFlightControls.js';
import {assertIdentity,entityMap,parseFrame,validateReplayManifest,playbackBracket} from './protocol.mjs';
THREE.Object3D.DEFAULT_UP.set(0,0,1);
const $=id=>document.getElementById(id),params=new URLSearchParams(location.search),wsUrl=params.get('ws');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x151b22);
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.02,100);camera.up.set(0,0,1);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.localClippingEnabled=true;document.body.appendChild(renderer.domElement);
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=0.174072265625;
// r161 already defaults to physically correct lighting (_useLegacyLights=false).
// Do not assign the removed physicallyCorrectLights property and imply it works.
const environmentRoom=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(renderer);
const environmentMap=pmrem.fromScene(environmentRoom,.04);scene.environment=environmentMap.texture;environmentRoom.dispose();pmrem.dispose();
const cutPlane=new THREE.Plane(new THREE.Vector3(0,0,-1),2.7);renderer.clippingPlanes=[cutPlane];$('cutaway').onchange=()=>renderer.clippingPlanes=$('cutaway').checked?[cutPlane]:[];
scene.add(new THREE.HemisphereLight(0xffffff,0x788796,2));
for(const [x,y,z,power] of [[3,-5,8,2.5],[-4,3,5,1.5]]){const light=new THREE.DirectionalLight(0xffffff,power);light.position.set(x,y,z);scene.add(light);}
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;
const flight=new FreeFlightControls(camera,renderer.domElement);let flying=false;
function toggleNavigation(){
 flying=!flying;const position=camera.position.clone(),quaternion=camera.quaternion.clone();
 if(flying){controls.enableDamping=false;controls.update();controls.enableDamping=true;camera.position.copy(position);camera.quaternion.copy(quaternion);}
 else{const distance=Math.max(1,camera.position.distanceTo(controls.target));controls.target.copy(camera.position).addScaledVector(camera.getWorldDirection(new THREE.Vector3()),distance);}
 controls.enabled=!flying;flight.setEnabled(flying);status.navigation_mode=flying?'fly':'orbit';
 $('navigation').textContent=flying?'切换环绕模式 · F':'切换自由漫游 · F';$('navigation').setAttribute('aria-pressed',String(flying));
 $('navigationHelp').textContent=flying?'W/S 前后 · A/D 左右 · Q 降 / E 升 · Shift 加速 · 拖动转向':'拖动旋转 · 滚轮缩放 · 右键平移';
 renderer.domElement.focus({preventScroll:true});
}
let root,nodes=new Map(),dynamic=new Map(),allowed,manifest,frames,playing=true,playTime=0,speed=1,lastNow=performance.now(),lastFrame,nextFrame,ws,loaded=false,raf=0,received=0,receivedBytes=0,measureStart=performance.now(),frameIndex=-1;
const status={mode:'loading',rendered_frames:0,received_frames:0,applied_frames:0,geometry_loaded:false,errors:[],external_requests:0};window.__alab=status;
status.environment='local procedural RoomEnvironment / PMREM';status.physically_correct_lights=renderer._useLegacyLights===false;
status.navigation_mode='orbit';status.movement_speed_m_s=flight.speed;status.fast_movement_speed_m_s=flight.fastSpeed;
$('navigation').onclick=toggleNavigation;
addEventListener('keydown',e=>{if(e.code==='KeyF'&&!e.repeat&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!flight.isInput(e.target)){e.preventDefault();toggleNavigation();}});
const tmpP1=new THREE.Vector3(),tmpP2=new THREE.Vector3(),tmpQ1=new THREE.Quaternion(),tmpQ2=new THREE.Quaternion();
// The only Isaac (w,x,y,z) -> three.js (x,y,z,w) conversion boundary.
function isaacQuaternion(target,q){return target.set(q[1],q[2],q[3],q[0]);}
function fail(e){const message=String(e?.message||e);$('error').textContent=message;$('mode').textContent='已拒绝加载';status.mode='refused';status.errors.push(message);playing=false;ws?.close();if(root)root.visible=false;loaded=false;}
function localURL(value,base=location.href){const url=new URL(value,base);if(url.origin!==location.origin||!['http:','https:'].includes(url.protocol))throw Error('文件必须来自同一站点');return url;}
async function fetchBytes(value,limit,base){const response=await fetch(localURL(value,base),{redirect:'error'});if(!response.ok)throw Error('文件载入失败：'+response.status);if(Number(response.headers.get('content-length'))>limit)throw Error('文件超过大小上限');const reader=response.body.getReader(),chunks=[];let count=0;try{while(true){const {done,value}=await reader.read();if(done)break;count+=value.byteLength;if(count>limit)throw Error('文件超过大小上限');chunks.push(value);}}catch(e){await reader.cancel();throw e;}const out=new Uint8Array(count);let at=0;for(const b of chunks){out.set(b,at);at+=b.byteLength;}return out.buffer;}
async function jsonFile(url,base){return JSON.parse(new TextDecoder().decode(await fetchBytes(url,2*1024*1024,base)));}
async function sha(buffer){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))].map(v=>v.toString(16).padStart(2,'0')).join('');}
async function geometry(url,identity,expectedHash){
 const bytes=await fetchBytes(url,32*1024*1024);if(await sha(bytes)!==expectedHash)throw Error('几何 SHA-256 不匹配');
 const view=new DataView(bytes);if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2||view.getUint32(8,true)!==bytes.byteLength)throw Error('GLB 头无效');
 const size=view.getUint32(12,true);if(20+size>bytes.byteLength)throw Error('GLB JSON 长度无效');const doc=JSON.parse(new TextDecoder().decode(new Uint8Array(bytes,20,size)));assertIdentity(doc.asset.extras,identity);
 if([...(doc.images||[]),...(doc.buffers||[])].some(x=>x.uri))throw Error('GLB 必须嵌入全部资源');
 const draco=new DRACOLoader();draco.setDecoderPath('./vendor/draco/');const loader=new GLTFLoader();loader.setDRACOLoader(draco);
 const gltf=await new Promise((resolve,reject)=>loader.parse(bytes,'',resolve,reject));draco.dispose();root=gltf.scene;
 const loadedMaterials=new Map();root.traverse(o=>{for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[])loadedMaterials.set(m.uuid,m);});
 status.transmission_materials=[...loadedMaterials.values()].filter(m=>m.transmission>0).map(m=>({name:m.name,type:m.type,transmission:m.transmission,ior:m.ior,thickness:m.thickness,transparent:m.transparent,opacity:m.opacity,source_shader_family:m.userData.source_shader_family||null}));
 status.orm_materials=[...loadedMaterials.values()].filter(m=>m.metalnessMap&&m.roughnessMap).map(m=>({name:m.name,metalness:m.metalness,roughness:m.roughness,metalness_map_color_space:m.metalnessMap.colorSpace,roughness_map_color_space:m.roughnessMap.colorSpace}));
 root.traverse(o=>{if(o.userData.entity_key){if(nodes.has(o.userData.entity_key))throw Error('几何实体重复');nodes.set(o.userData.entity_key,o);const p=o.userData.authored_pose_w;if(p){o.position.set(...p.slice(0,3));isaacQuaternion(o.quaternion,p.slice(3));}}});scene.add(root);status.geometry_loaded=true;status.geometry_bytes=bytes.byteLength;status.geometry_entities=nodes.size;status.geometry_sha256=expectedHash;status.coordinate_system='isaac_z_up';status.root_rotation=root.rotation.toArray().slice(0,3);
}
function bind(entities){allowed=entityMap(entities);dynamic.clear();for(const e of entities){const node=nodes.get(e.key);if(!node)throw Error('几何缺少实体：'+e.key);dynamic.set(e.id,node);}status.animated_entities=dynamic.size;}
function pose(a,b,alpha){for(const [id,v] of b.rows){const node=dynamic.get(id),u=a?.rows.get(id)||v;if(!node)throw Error('未绑定实体');node.position.lerpVectors(tmpP1.set(...u.p),tmpP2.set(...v.p),alpha);node.quaternion.slerpQuaternions(isaacQuaternion(tmpQ1,u.q),isaacQuaternion(tmpQ2,v.q),alpha);}status.tick=b.tick;status.sim_time=b.sim;status.applied_frames++;}
function frameCamera(){scene.updateMatrixWorld(true);const box=new THREE.Box3();const subjects=dynamic.size?dynamic:nodes;if(subjects.size){for(const n of subjects.values())box.expandByPoint(n.getWorldPosition(new THREE.Vector3()));}else box.setFromObject(root);const sphere=box.getBoundingSphere(new THREE.Sphere()),d=Math.max(1.5,sphere.radius/Math.sin(THREE.MathUtils.degToRad(camera.fov/2)));controls.target.copy(sphere.center);camera.position.copy(sphere.center).add(new THREE.Vector3(.6,.9,1.1).normalize().multiplyScalar(d*1.1));camera.near=Math.max(.01,d/1000);camera.far=Math.max(100,d*10);camera.updateProjectionMatrix();controls.update();}
async function replay(){
 const url=localURL(params.get('replay')||'./replay/manifest.json');manifest=await jsonFile(url);allowed=validateReplayManifest(manifest);assertIdentity(manifest,manifest);
 await geometry(localURL(manifest.geometry,url),manifest,manifest.geometry_sha256);bind(manifest.entities);
 const data=await fetchBytes(manifest.binary,64*1024*1024,url);if(data.byteLength!==manifest.byte_length||await sha(data)!==manifest.binary_sha256)throw Error('轨迹长度或 SHA-256 不匹配');
 frames=[];for(let i=0;i<manifest.frame_count;i++){const f=parseFrame(data,i*manifest.frame_bytes,manifest.frame_bytes,allowed);if(i&&(f.tick<=frames[i-1].tick||f.sim<=frames[i-1].sim||Math.abs(f.sim-frames[i-1].sim-1/manifest.fps)>1e-5))throw Error('轨迹时间不连续；接缝应分段声明');frames.push(f);}
 if(Math.abs(frames[0].sim-manifest.start_sim_time)>1e-6||Math.abs(frames.at(-1).sim-manifest.end_sim_time)>1e-6)throw Error('清单时间与轨迹不符');
 pose(frames[0],frames[0],1);frameCamera();status.mode='replay';status.playback_fps=manifest.fps;status.frame_count=frames.length;status.binary_bytes=data.byteLength;status.frame_bytes=manifest.frame_bytes;status.carry_mode=manifest.carry_mode;status.source_validation=manifest.validation;
 $('mode').textContent=manifest.label;$('scope').textContent=manifest.verified_grasp?(manifest.carry_mode==='kinematic_after_verified_grasp'?'局部诊断：抓取经双侧接触验证，随后运动学搬运；不代表完整工作流通过。':'录制轨迹包含抓取事件；不代表完整工作流已通过验收。'):'轨迹格式演示：尚未确认抓住目标。';$('identity').textContent=manifest.scene_id+' / '+manifest.layout_version;$('coverage').textContent=dynamic.size+' 个实体来自记录，其他实体保持静态。';$('seek').max=frames.at(-1).sim-frames[0].sim;$('seek').disabled=false;$('play').disabled=false;loaded=true;lastNow=performance.now();
}
async function staticScene(id){
 document.body.classList.add('live');const name=id+'_scene_'+(['wf01','wf04'].includes(id)?'surface':'color'),meta=await jsonFile('./'+name+'.geometry.json');await geometry('./'+name+'.glb',meta,meta.geometry_sha256);frameCamera();status.mode='static';$('mode').textContent='独立工作流场景 · 静态查看';$('scope').textContent='此场景暂未配置任务轨迹。';$('identity').textContent=meta.scene_id+' / '+meta.layout_version;loaded=true;
}
async function live(){
 document.body.classList.add('live');if(!/^wss?:\/\//.test(wsUrl))throw Error('WebSocket 地址无效');const file=params.get('geometry')||'./layout_v4_color_draco.glb',meta=await jsonFile(file.replace(/\.glb$/,'.geometry.json'));
 const expected=params.get('identity_digest');if(!/^[a-f0-9]{64}$/.test(expected||''))throw Error('实时模式需要 identity_digest');if(params.has('scene_id')&&params.get('scene_id')!==meta.scene_id)throw Error('场景 id 不匹配');if(params.has('geometry_sha256')&&params.get('geometry_sha256')!==meta.geometry_sha256)throw Error('指定几何 SHA 不匹配');
 await geometry(file,meta,meta.geometry_sha256);ws=new WebSocket(wsUrl);ws.binaryType='arraybuffer';let handshaken=false;
 ws.onopen=()=>ws.send(JSON.stringify({identity_digest:expected,geometry_sha256:meta.geometry_sha256}));
 ws.onmessage=event=>{try{if(typeof event.data==='string'){if(handshaken||event.data.length>2*1024*1024)throw Error('握手消息无效');const m=JSON.parse(event.data);if(!m.ok||m.handshake?.protocol!=='alab_transform_ws'||m.handshake.protocol_version!==1||m.handshake.schema_id!==1||m.handshake.identity_digest!==expected||m.handshake.geometry_sha256!==meta.geometry_sha256)throw Error('实时身份不匹配');assertIdentity(m.handshake,meta);bind(m.handshake.entities);handshaken=true;status.mode='live';$('mode').textContent='实时状态';$('scope').textContent='机械臂与物件由仿真状态驱动。';$('identity').textContent=meta.scene_id+' / '+meta.layout_version;return;}
 if(!handshaken)throw Error('未握手就收到状态帧');const f=parseFrame(event.data,0,event.data.byteLength,allowed);lastFrame=nextFrame;nextFrame=f;received++;receivedBytes+=event.data.byteLength;status.received_frames++;if(!loaded){pose(f,f,1);frameCamera();loaded=true;}}catch(e){fail(e);}};
 ws.onerror=()=>fail(Error('WebSocket 连接失败'));ws.onclose=()=>{if(status.mode!=='refused'){$('mode').textContent='实时连接已关闭';status.mode='closed';}};
}
$('play').onclick=()=>{playing=!playing;$('play').textContent=playing?'暂停':'播放';};$('seek').oninput=()=>{playTime=Number($('seek').value);};$('speed').onchange=()=>speed=Number($('speed').value);$('sceneSelect').value=params.get('scene')||'';$('sceneSelect').onchange=()=>location.href=$('sceneSelect').value?'?scene='+$('sceneSelect').value:location.pathname;
window.__alabSeek=seconds=>{if(!frames)throw Error('no replay');playTime=Math.max(0,Math.min(Number(seconds),frames.at(-1).sim-frames[0].sim));playing=false;};window.__alabPose=key=>{const n=nodes.get(key);return n?{position:n.position.toArray(),quaternion_xyzw:n.quaternion.toArray()}:null;};
window.__alabCamera=()=>({position:camera.position.toArray(),quaternion:camera.quaternion.toArray(),target:controls.target.toArray(),up:camera.up.toArray(),navigation:status.navigation_mode});
window.__alabView=(eye,target,fov=45)=>{camera.position.set(...eye);controls.target.set(...target);camera.fov=fov;camera.updateProjectionMatrix();controls.update();};
window.__alabExposure=value=>{if(!Number.isFinite(value)||value<=0||value>10)throw Error('Invalid exposure');renderer.toneMappingExposure=value;status.exposure=value;};
function animate(now){requestAnimationFrame(animate);const delta=Math.max(0,(now-lastNow)/1000);lastNow=now;
 if(loaded&&status.mode==='replay'){
  const duration=frames.at(-1).sim-frames[0].sim;if(playing)playTime+=delta*speed;if(playTime>duration){if($('loop').checked)playTime%=duration;else{playTime=duration;playing=false;$('play').textContent='播放';}}
  const {index,next,alpha}=playbackBracket(playTime,manifest.fps,frames.length);pose(frames[index],frames[next],alpha);frameIndex=index;status.frame_index=index;status.play_time=playTime;
  $('seek').value=playTime;$('time').textContent=playTime.toFixed(1)+' / '+duration.toFixed(1)+' s';const tick=frames[index].tick;const grasp=manifest.events?.find(e=>e.kind==='verified_grasp'),release=manifest.events?.find(e=>e.kind==='confirmed_release');$('status').textContent=release&&tick>=release.tick?'已释放':grasp&&tick>=grasp.tick?'已验证抓取 · 运动学搬运':'接近与抓取';
 }else if(loaded&&status.mode==='live'&&nextFrame){const alpha=lastFrame?Math.max(0,Math.min(1,(now-34-lastFrame.received)/Math.max(1,nextFrame.received-lastFrame.received))):1;pose(lastFrame,nextFrame,alpha);}
 if(flying)flight.update(delta);else controls.update();renderer.render(scene,camera);raf++;status.rendered_frames++;
 if(now-measureStart>1000){status.browser_render_fps=raf*1000/(now-measureStart);status.receive_fps=received*1000/(now-measureStart);status.receive_bytes_per_second=receivedBytes*1000/(now-measureStart);$('stats').textContent='浏览器 '+status.browser_render_fps.toFixed(1)+' fps'+(status.mode==='live'?' · 接收 '+status.receive_fps.toFixed(1)+' Hz':' · 回放采样 '+(manifest?.fps||'–')+' Hz');raf=received=receivedBytes=0;measureStart=now;}
}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
const sceneId=params.get('scene')||(params.has('replay')?'replay':'wf01');$('sceneSelect').value=sceneId;
(wsUrl?live():sceneId==='replay'?replay():/^wf0[1-5]$/.test(sceneId)?staticScene(sceneId):Promise.reject(Error('未知场景'))).catch(fail);requestAnimationFrame(animate);
