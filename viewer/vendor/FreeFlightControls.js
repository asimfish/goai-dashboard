// Project-owned Z-up fly controls. No pointer lock, network, or Y-up root rotation.
import {Vector3} from './three.module.js';
export class FreeFlightControls {
 constructor(camera,element){
  this.camera=camera;this.element=element;this.enabled=false;this.keys=new Set();this.drag=null;
  this.speed=2.5;this.fastSpeed=7;this.sensitivity=.003;this.document=element.ownerDocument;this.window=this.document.defaultView;
  this.forward=new Vector3();this.right=new Vector3();this.up=new Vector3(0,0,1);this.motion=new Vector3();
  element.tabIndex=0;
  this.keydown=e=>{if(!this.enabled||this.isInput(e.target)||e.ctrlKey||e.metaKey||e.altKey)return;if(['KeyW','KeyS','KeyA','KeyD','KeyQ','KeyE','Space','ShiftLeft','ShiftRight'].includes(e.code)){this.keys.add(e.code);e.preventDefault();}};
  this.keyup=e=>this.keys.delete(e.code);
  this.clear=()=>{this.keys.clear();if(this.drag!==null&&element.hasPointerCapture?.(this.drag))element.releasePointerCapture(this.drag);this.drag=null;};
  this.down=e=>{if(!this.enabled||e.button!==0)return;element.focus({preventScroll:true});this.drag=e.pointerId;element.setPointerCapture(e.pointerId);this.x=e.clientX;this.y=e.clientY;e.preventDefault();};
  this.move=e=>{if(!this.enabled||e.pointerId!==this.drag)return;const dx=e.clientX-this.x,dy=e.clientY-this.y;this.x=e.clientX;this.y=e.clientY;
   camera.getWorldDirection(this.forward);const yaw=Math.atan2(this.forward.y,this.forward.x)-dx*this.sensitivity;
   const pitch=Math.max(-Math.PI/2+.01,Math.min(Math.PI/2-.01,Math.asin(Math.max(-1,Math.min(1,this.forward.z)))-dy*this.sensitivity));
   this.forward.set(Math.cos(pitch)*Math.cos(yaw),Math.cos(pitch)*Math.sin(yaw),Math.sin(pitch));camera.up.copy(this.up);camera.lookAt(this.forward.add(camera.position));
  };
  this.end=e=>{if(e.pointerId===this.drag){if(element.hasPointerCapture?.(this.drag))element.releasePointerCapture(this.drag);this.drag=null;}};
  this.focus=e=>{if(this.isInput(e.target))this.clear();};
  this.visibility=()=>{if(this.document.hidden)this.clear();};
  this.window.addEventListener('keydown',this.keydown);this.window.addEventListener('keyup',this.keyup);this.window.addEventListener('blur',this.clear);
  this.document.addEventListener('visibilitychange',this.visibility);this.document.addEventListener('focusin',this.focus);
  element.addEventListener('pointerdown',this.down);element.addEventListener('pointermove',this.move);element.addEventListener('pointerup',this.end);element.addEventListener('pointercancel',this.end);element.addEventListener('lostpointercapture',this.end);
 }
 isInput(target){return !!target?.closest?.('input,select,textarea,button,[contenteditable="true"]');}
 setEnabled(enabled){this.clear();this.enabled=enabled;}
 update(seconds){
  if(!this.enabled||!this.keys.size)return;
  this.camera.getWorldDirection(this.forward);this.right.crossVectors(this.forward,this.up).normalize();
  const k=this.keys;this.motion.copy(this.forward).multiplyScalar(Number(k.has('KeyW'))-Number(k.has('KeyS')));
  this.motion.addScaledVector(this.right,Number(k.has('KeyD'))-Number(k.has('KeyA')));
  this.motion.z+=Number(k.has('KeyE')||k.has('Space'))-Number(k.has('KeyQ'));
  if(this.motion.lengthSq())this.camera.position.addScaledVector(this.motion.normalize(),(k.has('ShiftLeft')||k.has('ShiftRight')?this.fastSpeed:this.speed)*Math.min(.1,Math.max(0,seconds)));
 }
 dispose(){this.clear();this.window.removeEventListener('keydown',this.keydown);this.window.removeEventListener('keyup',this.keyup);this.window.removeEventListener('blur',this.clear);this.document.removeEventListener('visibilitychange',this.visibility);this.document.removeEventListener('focusin',this.focus);for(const [name,fn] of [['pointerdown',this.down],['pointermove',this.move],['pointerup',this.end],['pointercancel',this.end],['lostpointercapture',this.end]])this.element.removeEventListener(name,fn);}
}
