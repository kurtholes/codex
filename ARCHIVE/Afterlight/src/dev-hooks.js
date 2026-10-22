// Served only by the development server. The production build does not copy this file.
import { RELAYS, MEMORIES, riverX } from './game.js';
export function install(api){
 Object.defineProperty(window,'__AFTERLIGHT',{configurable:true,value:{
  state:()=>structuredClone(api.getState()),
  mode:api.getMode,
  teleport(s,lateral=0){const st=api.getState();st.s=s;st.lateral=lateral;st.speed=0;api.world.resetCamera();},
  setState:api.setState,
  play:api.play,
  relays:RELAYS,
  memories:MEMORIES,
  stats:()=>({calls:api.world.renderer.info.render.calls,triangles:api.world.renderer.info.render.triangles,quality:api.world.quality}),
  world:api.world
 }});
}
