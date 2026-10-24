import {development} from './game.js';
window.__test=development;
const fps=document.createElement('div');fps.style='position:absolute;top:90px;right:30px;color:white';document.body.append(fps);setInterval(()=>fps.textContent=development.state.fps.toFixed(0)+' FPS',500);
