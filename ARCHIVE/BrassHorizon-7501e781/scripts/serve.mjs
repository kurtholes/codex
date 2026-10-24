import http from 'node:http';import {readFile} from 'node:fs/promises';import {resolve,extname,sep} from 'node:path';import {fileURLToPath} from 'node:url';
const dev=process.argv.includes('--dev'),base=resolve(fileURLToPath(new URL('../',import.meta.url)),dev?'.':'dist'),port=Number(process.env.PORT||4173);const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.png':'image/png'};
const injection=`
window.__BRASS_DEV__={state,world,camera,renderer,buy,cost,setQuality,fire,blast,startSortie,frontier,save,
teleport(x,y,z){state.pos.set(x,y,z);},give(n){state.currency+=n;renderUpgrades();},
keys(k){keys=k;},aim(x,y){aim.set(x,y);},fps(){return state.fps;},
nearestTarget(){return world.parts.filter(p=>!p.dead).sort((a,b)=>a.pos.distanceTo(state.pos)-b.pos.distanceTo(state.pos))[0];},
pointAt(p){let v=p.clone().project(camera);aim.set(v.x,v.y);},
overlay(){let d=document.createElement('div');d.id='devfps';d.style='position:absolute;top:75px;right:35px;font:12px monospace;color:#ff0';document.body.append(d);setInterval(()=>d.textContent=state.fps.toFixed(1)+' FPS | '+state.quality+' | '+renderer.info.render.calls+' draws',500);}};
`;
http.createServer(async(req,res)=>{try{let path=resolve(base,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!path.startsWith(base+sep)&&path!==base)throw Error();if(path===base||req.url.endsWith('/'))path=resolve(path,'index.html');let body=await readFile(path);if(dev&&path.endsWith('/src/main.js'))body=Buffer.from(body.toString().replace('/* DEV_INJECT */',injection));res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'0.0.0.0',()=>console.log((dev?'Development':'Production')+' http://localhost:'+port));
