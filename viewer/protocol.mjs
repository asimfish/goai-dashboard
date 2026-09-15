export const IDENTITY_KEYS=['scene_id','layout_version','input_manifest_sha256'];
export function assertIdentity(a,b){
 for(const key of IDENTITY_KEYS)if(typeof a?.[key]!=='string'||a[key]!==b?.[key])throw Error('场景身份不匹配：'+key);
 if(a.coordinate_system!=='isaac_z_up'||b.coordinate_system!=='isaac_z_up'||a.quaternion!=='isaac_wxyz'||b.quaternion!=='isaac_wxyz')throw Error('坐标或四元数约定不匹配');
}
export function entityMap(rows){
 if(!Array.isArray(rows)||rows.length<1||rows.length>4096)throw Error('实体表长度无效');
 const out=new Map(),keys=new Set();
 for(const e of rows){if(!Number.isInteger(e.id)||e.id<0||e.id>65535||typeof e.key!=='string'||out.has(e.id)||keys.has(e.key))throw Error('实体 id/key 无效或重复');out.set(e.id,e);keys.add(e.key);}
 return out;
}
export function parseFrame(buffer,offset=0,length=buffer.byteLength-offset,allowed=null){
 if(!Number.isInteger(offset)||!Number.isInteger(length)||length<32||length>32+4096*30||offset<0||offset+length>buffer.byteLength)throw Error('帧长度无效');
 const d=new DataView(buffer,offset,length);
 if(d.getUint32(0)!==0x414c4142||d.getUint32(16)!==1||d.getUint16(22)!==0)throw Error('帧协议无效');
 const count=d.getUint16(20);if(length!==32+count*30||(allowed&&count!==allowed.size))throw Error('实体数量与帧长度不符');
 const sim=d.getFloat64(8),captureUnixMs=d.getFloat64(24);if(!Number.isFinite(sim)||!Number.isFinite(captureUnixMs))throw Error('时间戳无效');
 const rows=new Map();let at=32;
 for(let i=0;i<count;i++,at+=30){const id=d.getUint16(at),p=[],q=[];
  if(rows.has(id)||(allowed&&!allowed.has(id)))throw Error('未知或重复实体 id');
  for(let j=0;j<7;j++){const v=d.getFloat32(at+2+4*j);if(!Number.isFinite(v))throw Error('非有限位姿');(j<3?p:q).push(v);}
  if(Math.abs(Math.hypot(...q)-1)>.01)throw Error('四元数无效');rows.set(id,{p,q});
 }
 return {tick:d.getUint32(4),sim,rows,captureUnixMs,received:performance.now()};
}
export function validateReplayManifest(m){
 const entities=entityMap(m.entities);
 if(m.protocol!=='alab_transform_ws'||m.protocol_version!==1||m.schema_id!==1||!Number.isFinite(m.fps)||m.fps<=0||m.fps>120||!Number.isInteger(m.frame_count)||m.frame_count<2||m.frame_count>100000||m.frame_bytes!==32+entities.size*30||m.byte_length!==m.frame_count*m.frame_bytes||m.byte_length>64*1024*1024)throw Error('回放清单无效');
 for(const k of ['binary_sha256','geometry_sha256','input_manifest_sha256','identity_digest'])if(!/^[a-f0-9]{64}$/.test(m[k]||''))throw Error('缺少校验哈希：'+k);
 return entities;
}
export function playbackBracket(seconds,fps,count){
 if(!Number.isFinite(seconds)||!Number.isFinite(fps)||fps<=0||!Number.isInteger(count)||count<2)throw Error('播放时钟无效');
 const sample=Math.max(0,Math.min(count-1,seconds*fps)),index=Math.floor(sample);
 return {index,next:Math.min(count-1,index+1),alpha:sample-index};
}
