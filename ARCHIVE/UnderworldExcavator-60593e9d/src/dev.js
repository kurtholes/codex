import {development} from './game.js';
window.__excavator=development;
const el=document.createElement('div');el.id='devFps';document.body.append(el);setInterval(()=>el.textContent=development.state.fps.toFixed(0)+' FPS · DEV',500);
