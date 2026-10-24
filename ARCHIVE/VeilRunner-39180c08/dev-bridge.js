// Only injected by server.mjs --dev; absent from dist.
const devFps=document.createElement('div');devFps.id='devFps';document.body.append(devFps);
window.__VEIL_DEV__={state,player,get metrics(){return {elapsed,frames,fps,firstAction,totalHits,brokenCount,misses,quality,mode,quickHits,quickElapsed,money:state.money,tiers:[...state.tiers],target:target.position.toArray(),position:player.pos.toArray()}},teleport(x,y,z){player.pos.set(x,y,z);player.vel.set(0,0,0)},give(n){state.money+=n;renderWeb()},buy,auto(v){autoDrive=v},quality:setQuality,start:startMode,pulse,jump};
setInterval(()=>{devFps.textContent=`DEV · ${fps.toFixed(0)} FPS · ${renderer.info.render.calls} calls · ${renderer.info.render.triangles} tris`},500);
// Grid route finder drives real movement around solid architecture in headless tests.
let navPath=[],navTarget='',navTimer=0;
function findPath(){
 const cell=3,start=[Math.round(player.pos.x/cell),Math.round(player.pos.z/cell)],goal=[Math.round(target.position.x/cell),Math.round(target.position.z/cell)],key=(x,z)=>x+','+z;
 const blocked=(x,z)=>colliders.some(c=>Math.abs(x*cell-c.x)<c.w/2+1&&Math.abs(z*cell-c.z)<c.d/2+1);
 const frontier=[{x:start[0],z:start[1],g:0,f:0}],seen=new Map(),parents=new Map();seen.set(key(...start),0);let end=null;
 for(let n=0;n<12000&&frontier.length;n++){
  frontier.sort((a,b)=>a.f-b.f);const a=frontier.shift();if(Math.hypot(a.x-goal[0],a.z-goal[1])<1.5){end=a;break}
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){let x=a.x+dx,z=a.z+dz;if(x< -78||x>78||z< -94||z>41||blocked(x,z)||dx&&dz&&(blocked(a.x+dx,a.z)||blocked(a.x,a.z+dz)))continue;let g=a.g+Math.hypot(dx,dz),k=key(x,z);if((seen.get(k)??Infinity)<=g)continue;seen.set(k,g);parents.set(k,key(a.x,a.z));frontier.push({x,z,g,f:g+Math.hypot(x-goal[0],z-goal[1])})}
 }
 let path=[];if(end){let k=key(end.x,end.z);while(parents.has(k)){let [x,z]=k.split(',').map(Number);path.push({x:x*cell,z:z*cell});k=parents.get(k)}path.reverse()}path.push(target.position);return path;
}
window.__VEIL_DEV__.navigate=v=>{autoDrive=v;navPath=[];navTarget=''};
setInterval(()=>{
 if(!autoDrive)return;const id=target.position.toArray().join(',');if(navTarget!==id||navTimer++>30){navTarget=id;navPath=findPath();navTimer=0}
 while(navPath.length>1&&Math.hypot(navPath[0].x-player.pos.x,navPath[0].z-player.pos.z)<2)navPath.shift();autoDrive=navPath[0]||true;
},150);
