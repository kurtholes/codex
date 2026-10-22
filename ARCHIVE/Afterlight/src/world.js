import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { riverX, riverWidth, RELAYS, MEMORIES, LENGTH, clamp } from './game.js';
const cyan=0x55eff0,pink=0xff397f,gold=0xffa747;
const TAU=Math.PI*2;
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const shared={time:{value:0},dawn:{value:0},release:{value:0}};
const stoneVertex=`varying vec3 vWorld; varying vec3 vNormal;
void main(){ vec4 p=vec4(position,1.); vec3 n=normal;
#ifdef USE_INSTANCING
p=instanceMatrix*p;n=mat3(instanceMatrix)*n;
#endif
vWorld=(modelMatrix*p).xyz;vNormal=normalize(mat3(modelMatrix)*n);gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);}`;
const stoneFragment=`precision highp float;varying vec3 vWorld;varying vec3 vNormal;uniform float time;uniform float dawn;uniform vec3 tint;uniform float ink;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float tex(vec2 p){vec2 cell=floor(p);vec2 f=fract(p);float scratch=step(.965,f.x)*step(.15,hash(cell));float bands=step(.86,f.y)*step(.67,hash(cell*1.2));return scratch+bands*.65;}
void main(){vec3 w=pow(abs(normalize(vNormal)),vec3(4.));w/=max(dot(w,vec3(1.)),.001);
vec3 p=vWorld*.14;float tri=tex(p.yz)*w.x+tex(p.xz)*w.y+tex(p.xy)*w.z;
float grain=hash(floor(vWorld.xz*2.3));float layer=sin(vWorld.y*1.6+sin(vWorld.x*.1))* .045;
float diffuse=max(dot(normalize(vNormal),normalize(vec3(-.6,.7,-.5))),0.);
vec3 col=tint*(.32+diffuse*.7+grain*.22+layer);
float strata=pow(max(0.,sin(vWorld.y*.8+sin(vWorld.z*.01)*4.)),28.)*.24;
vec3 signal=mix(vec3(.005,.48,.65),vec3(1.,.025,.16),step(.72,hash(floor(vWorld.xz*.018))));
float fleck=step(.78,hash(floor(vWorld.xz*.04)))*step(.6,hash(floor(vWorld.xy*.08)));
col+=signal*(tri*.95+strata+fleck*.22)*ink*(1.+dawn*1.7);
col+=vec3(.32,.055,.015)*pow(diffuse,3.)*.2;col+=vec3(.1,.15,.13)*dawn;
float dist=distance(cameraPosition,vWorld);float fog=1.-exp(-dist*.00058);vec3 mist=mix(vec3(.022,.026,.07),vec3(.42,.07,.105),clamp(1.-vWorld.y/250.,0.,1.));col=mix(col,mist,fog*.86);
gl_FragColor=vec4(col,1.);}`;
function stone(tint=0x101c2b,ink=1){return new THREE.ShaderMaterial({vertexShader:stoneVertex,fragmentShader:stoneFragment,uniforms:{...shared,tint:{value:new THREE.Color(tint)},ink:{value:ink}}});}
const dark=stone(0x101928,1.1), cliff=stone(0x0d1827,.65), metal=new THREE.MeshStandardMaterial({color:0x263b4c,metalness:.78,roughness:.38});
function emissive(color,power=1){return new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(power)});}
function mesh(g,m,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);return o;}
function pathPoint(s,lateral=0,y=0){return new THREE.Vector3(riverX(s)+lateral,y,-s);}
function polygonColumn(r,h,seed=5,sides=11){
  const random=rng(seed), vertices=[],indices=[];const levels=[0,.08,.2,.24,.45,.49,.65,.69,.83,1];const irregular=Array.from({length:sides},()=>.8+random()*.35);
  for(let j=0;j<levels.length;j++)for(let k=0;k<sides;k++){const a=k/sides*TAU,shrink=1-levels[j]*.4,step=(j%2)*.08;vertices.push(Math.cos(a)*r*(shrink-step)*irregular[k],h*levels[j]+(j===levels.length-1?random()*h*.13:0),Math.sin(a)*r*(shrink-step)*irregular[k]);}
  for(let j=0;j<levels.length-1;j++)for(let k=0;k<sides;k++){const a=j*sides+k,b=j*sides+(k+1)%sides,c=a+sides,d=b+sides;indices.push(a,c,b,b,c,d);}
  for(let k=1;k<sides-1;k++)indices.push((levels.length-1)*sides,(levels.length-1)*sides+k,(levels.length-1)*sides+k+1);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return g.toNonIndexed();
}
function batchBoxes(items,material,parent){
  if(!items.length)return;const b=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),material,items.length);const o=new THREE.Object3D();
  items.forEach((p,i)=>{o.position.set(p[0],p[1],p[2]);o.scale.set(p[3],p[4],p[5]);o.rotation.set(0,p[6]||0,0);o.updateMatrix();b.setMatrixAt(i,o.matrix);});b.computeBoundingSphere();parent.add(b);return b;
}
// Merge static modeled parts by material without a runtime geometry utility dependency.
function mergeStatic(root,exclude=new Set()){
 root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),groups=new Map();
 function visit(o){if(exclude.has(o))return;if(o.isMesh&&!o.isInstancedMesh&&!Array.isArray(o.material)){const list=groups.get(o.material)||[];list.push(o);groups.set(o.material,list);}for(const child of o.children)visit(child);}
 visit(root);
 for(const [material,parts] of groups){if(parts.length<2)continue;const positions=[],normals=[];
  for(const part of parts){let g=part.geometry.index?part.geometry.toNonIndexed():part.geometry.clone();g.applyMatrix4(inverse.clone().multiply(part.matrixWorld));const p=g.getAttribute('position'),n=g.getAttribute('normal');for(let i=0;i<p.count;i++){positions.push(p.getX(i),p.getY(i),p.getZ(i));normals.push(n?n.getX(i):0,n?n.getY(i):1,n?n.getZ(i):0);}part.removeFromParent();g.dispose();}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));root.add(mesh(g,material));
 }
}
function line(points,color,opacity=1){return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity}));}

export class World {
 constructor(canvas,quality='balanced'){
  this.canvas=canvas;this.renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance',alpha:false});
  this.renderer.setClearColor(0x040711);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.NoToneMapping;
  this.scene=new THREE.Scene();this.scene.fog=new THREE.FogExp2(0x101229,.0007);
  this.camera=new THREE.PerspectiveCamera(58,1,.35,11000);this.camera.position.set(0,15,55);
  this.clock=0;this.pulseAge=100;this.orbit=0;this.pitch=0;this.hitFlash=0;this.quality=quality;this.relays=[];this.memoryMeshes=[];this.chunks=[];
  this.makeSky();this.makeLandscape();this.makeArchitecture();this.makeRiver();this.makeRelays();this.makeSkiff();this.makeMotes();this.makePost();this.setQuality(quality);this.resize();
 }
 makeSky(){
  const material=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:shared,vertexShader:`varying vec3 ray;void main(){ray=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`precision highp float;varying vec3 ray;uniform float time;uniform float dawn;uniform float release;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){vec3 d=normalize(ray);float y=d.y;vec3 col=mix(vec3(.006,.009,.024),vec3(.012,.014,.04),max(0.,y));
float horizon=exp(-abs(y-.025)*6.);float warm=exp(-abs(y-.035)*14.);col+=vec3(.9,.035,.24)*horizon+vec3(2.,.82,.10)*warm;
float sun=pow(max(0.,dot(d,normalize(vec3(-.28,.035,-1.)))),90.);col+=vec3(1.4,.5,.09)*sun*exp(-abs(y-.02)*15.);
float stripe=sin(y*1800.+sin(d.x*80.)*.4);col*=.91+.09*step(.1,stripe);
vec2 uv=vec2(atan(d.x,d.z),y);vec2 cell=floor(uv*vec2(350.,190.));float stars=pow(hash(cell),80.)*smoothstep(.16,.6,y);col+=stars*vec3(.12,.22,.3);
col=mix(col,col+vec3(.12,.12,.025),dawn);float ascension=pow(hash(floor(uv*vec2(180.,90.)-vec2(0.,time*.5))),34.)*smoothstep(.02,.4,y)*release;col+=vec3(.3,.8,.85)*ascension;gl_FragColor=vec4(col,1.);}`});
  this.sky=mesh(new THREE.SphereGeometry(10500,48,24),material);this.sky.renderOrder=-100;this.scene.add(this.sky);
  this.scene.add(new THREE.HemisphereLight(0x60aabb,0x2b0c23,2.7));const sun=new THREE.DirectionalLight(0xffb88b,2.8);sun.position.set(-400,200,-1200);this.scene.add(sun);
 }
 makeLandscape(){
  const random=rng(701);
  for(let start=-500;start<LENGTH+1400;start+=500){
   const chunk=new THREE.Group();this.scene.add(chunk);this.chunks.push({group:chunk,s:start+250});
   const vertices=[],indices=[];const nx=70,nz=25;
   for(let iz=0;iz<=nz;iz++){const s=start+iz*500/nz;const center=riverX(s),width=riverWidth(s);
    for(let ix=0;ix<=nx;ix++){const off=(ix/nx-.5)*2600;const bank=Math.max(0,Math.abs(off)-width);const ridge=Math.sin((center+off)*.015+s*.006)*.5+.5;
     let height=bank<6?-3:Math.pow(bank,.72)*.7+(Math.sin(off*.021+s*.011)+Math.sin(off*.043-s*.023))*.13*Math.min(bank,100);
     height+=Math.max(0,bank-160)*.12*ridge; height=Math.max(-4,height);
     // Terraces and fractures are geometry; the fine surface pattern uses world coordinates.
     if(height>6)height=Math.floor(height/4.5)*4.5;
     vertices.push(center+off,height,-s);
    }
   }
   for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;indices.push(a,b,c,b,d,c);}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();chunk.add(mesh(g,cliff));
   const boxes=[],lights=[];
   for(let k=0;k<90;k++){
    const s=start+random()*500,side=random()<.5?-1:1,off=side*(riverWidth(s)+55+random()*850),x=riverX(s)+off;
    const h=10+random()**2*160,y=Math.max(5,Math.pow(Math.abs(off)-riverWidth(s),.72)*.68);const w=4+random()*18;
    boxes.push([x,y+h/2,-s,w,h,w*(.7+random()),0]);
    if(k%2===0)lights.push([x-w*.51,y+h*.5,-s, .4,h*(.4+random()*.5),.5,0]);
    if(k%5===0)lights.push([x,y+h,-s,w+5,.5,w+5,0]);
   }
   batchBoxes(boxes,dark,chunk);batchBoxes(lights,emissive(start%1000===0?pink:cyan,.6),chunk);
  }
  // Slender streaks echo the reference's broken vertical light and scanline skyline.
  const p=[],colors=[];for(let i=0;i<1400;i++){const s=-250+random()*9400,x=riverX(s)+(random()-.5)*2500,y=15+random()*600,h=10+random()**3*430;const c=new THREE.Color([cyan,pink,gold][i%3]).multiplyScalar(.2+random()*.55);p.push(x,y,-s,x,y+h,-s);colors.push(c.r,c.g,c.b,c.r,c.g,c.b);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));this.scene.add(new THREE.LineSegments(g,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.45,fog:true})));
 }
 makeArchitecture(){
  const placements=[{s:850,side:1,r:108,h:205},{s:1450,side:-1,r:80,h:170},{s:3000,side:1,r:150,h:270},{s:3570,side:-1,r:110,h:210},{s:5100,side:-1,r:135,h:250},{s:5790,side:1,r:120,h:235},{s:7320,side:1,r:230,h:440}];
  placements.forEach((p,index)=>{
   const rand=rng(845+index*91),group=new THREE.Group();group.position.copy(pathPoint(p.s,p.side*(p.r+100),3));this.scene.add(group);this.chunks.push({group,s:p.s,landmark:true});
   group.add(mesh(polygonColumn(p.r*1.5,p.h*.43,300+index,17),cliff,0,0,0));
   group.add(mesh(polygonColumn(p.r,p.h,431+index,15),dark,0,p.h*.17,0));
   const structures=[],traces=[],hot=[];
   for(let j=0;j<30;j++){
    const a=j/30*TAU,r=p.r*(.42+rand()*.62),x=Math.cos(a)*r,z=Math.sin(a)*r,h=p.h*(.25+rand()*.85),base=p.h*.28,w=8+rand()*17;
    const tower=mesh(polygonColumn(w,h,index*30+j+46,6+Math.floor(rand()*4)),dark,x,base,z);group.add(tower);
    for(let k=0;k<4;k++){
     structures.push([x+(k%2?1:-1)*w*.75,base+h*.34,z+(k<2?1:-1)*w*.45,w*.15,h*.65,w*.17,a]);
     traces.push([x+(k%2?1:-1)*w*.65,base+h*.6,z-w*.82,.35,h*.75,.45,0]);
    }
    const top=base+h;structures.push([x,top+7,z,w*.3,15+rand()*20,w*.3,0]);
    for(let k=0;k<3;k++)traces.push([x,base+h*(.2+k*.23),z,w*2.1,.45,w*1.8,0]);
    if(j%3===0)hot.push([x,top+1,z,w*.55,2,w*.55,0]);
   }
   // A broken crown, open ribs and cantilevered galleries give each citadel its silhouette.
   for(let j=0;j<18;j++){
    const a=j/18*TAU,r=p.r*.82;const h=p.h*(.65+rand()*.6);structures.push([Math.cos(a)*r,h*.5+15,Math.sin(a)*r,4,h,5,a]);
    traces.push([Math.cos(a)*r,h*.5+15,Math.sin(a)*r,1,h*.9,1,a]);
    if(j%3!==0)structures.push([Math.cos(a)*r,p.h*.7,Math.sin(a)*r,38,4,9,-a]);
   }
   batchBoxes(structures,dark,group);batchBoxes(traces,emissive(index%2?pink:cyan,.85),group);batchBoxes(hot,emissive(gold,1.3),group);
   const ribbons=[];for(let j=0;j<4;j++){const pts=[];for(let k=0;k<90;k++){const a=k/90*TAU*1.4+j*.07,rad=p.r*(.8+k/150);pts.push(new THREE.Vector3(Math.cos(a)*rad,p.h*.38-k*.45,Math.sin(a)*rad));}ribbons.push(line(pts,j%2?cyan:pink,.65));}group.add(...ribbons);mergeStatic(group);
  });
 }
 makeRiver(){
  this.water=new THREE.ShaderMaterial({uniforms:shared,vertexShader:`varying vec3 wp;void main(){wp=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.);}`,fragmentShader:`precision highp float;varying vec3 wp;uniform float time;uniform float dawn;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.)),f.x),f.y);}
void main(){vec2 p=wp.xz;float wave=sin(p.x*.39+sin(p.y*.035)*7.+time*.6)+sin(p.x*.67-p.y*.095-time*.9)*.4;float n=noise(p*vec2(.16,.018)+vec2(sin(p.y*.01)*2.,time*.15))*.75+noise(p*vec2(.46,.07)+vec2(time*.2,0.))*.25;float fil=pow(max(0.,sin(n*18.+p.x*.08)),7.);float bits=step(.985,h(floor(p*vec2(2.9,.9)+vec2(0.,time*1.9))));
float s=-p.y;float center=sin(s/590.)*175.+sin(s/260.)*65.;float offset=p.x-center;float stream=exp(-pow((offset-18.*sin(s*.012))/36.,2.));
vec3 col=vec3(.004,.035,.075)+vec3(.008,.32,.49)*fil;col+=vec3(.005,.22,.3)*stream*(.3+fil*.9);float hot=pow(max(0.,sin(p.x*.025+p.y*.009+wave*.3)),18.);col+=mix(vec3(.92,.04,.18),vec3(1.,.46,.1),step(.7,sin(p.y*.017)))*hot*.65;col+=bits*vec3(.07,.43,.55);
float horizon=pow(max(0.,1.-length(wp.xz-cameraPosition.xz)/1800.),.5);col=mix(vec3(.24,.055,.085),col,horizon);col+=dawn*vec3(.12,.09,.02);gl_FragColor=vec4(col,1.);}`});
  for(let start=-500;start<LENGTH+1100;start+=500){const chunk=new THREE.Group();this.scene.add(chunk);this.chunks.push({group:chunk,s:start+250});const v=[],ind=[];for(let i=0;i<=80;i++){const s=start+i*500/80,w=riverWidth(s);v.push(riverX(s)-w,0,-s,riverX(s)+w,0,-s);if(i<80){const a=i*2;ind.push(a,a+1,a+2,a+1,a+3,a+2);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(ind);chunk.add(mesh(g,this.water));
   for(const side of [-1,1]){const pts=[];for(let i=0;i<=80;i++){const s=start+i*500/80;pts.push(pathPoint(s,side*riverWidth(s),.5));}chunk.add(line(pts,side===1?pink:cyan,.7));}
  }
  // Sparse luminous current filaments are world-space curves, not UV-stretched textures.
  for(let start=-500;start<8500;start+=500){const vertices=[],colors=[];for(let j=0;j<12;j++){const c=new THREE.Color(j%4===0?gold:cyan);for(let s=start;s<start+500;s+=12){for(const k of [s,s+12]){const p=pathPoint(k,Math.sin(k*.004+j)*18+(j-5.5)*11,.12);vertices.push(p.x,p.y,p.z);colors.push(c.r,c.g,c.b);}}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const o=new THREE.LineSegments(g,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.14}));this.scene.add(o);this.chunks.push({group:o,s:start+250});}
 }
 makeRelays(){
  const mat=emissive(cyan,1.4);
  RELAYS.forEach((r,i)=>{
   const g=new THREE.Group();g.position.copy(pathPoint(r.s,0,0));this.scene.add(g);
   const base=mesh(polygonColumn(16,4,i+92,12),dark,0,-1,0);g.add(base);
   const outer=new THREE.Group();outer.position.y=18;g.add(outer);
   for(let k=0;k<8;k++){const a=k/8*TAU;const rib=mesh(new THREE.BoxGeometry(1.4,11,2.8),metal,Math.cos(a)*12,Math.sin(a)*12,0);rib.rotation.z=a;outer.add(rib);}
   const ring=mesh(new THREE.TorusGeometry(12,.27,5,64),emissive(r.color,1.5));outer.add(ring);
   const inner=mesh(new THREE.TorusGeometry(8,.17,4,48),mat);inner.rotation.y=.65;outer.add(inner);
   const core=mesh(new THREE.OctahedronGeometry(2,1),emissive(r.color,2));outer.add(core);
   const beam=mesh(new THREE.CylinderGeometry(.25,.8,340,7,1,true),new THREE.MeshBasicMaterial({color:r.color,transparent:true,opacity:.45,depthWrite:false}),0,176,0);g.add(beam);
   for(const side of [-1,1]){
    const support=mesh(polygonColumn(3.6,28,8+i,6),dark,side*18,0,0);g.add(support);g.add(mesh(new THREE.BoxGeometry(.35,25,.6),mat,side*18,14,3));
   }
   mergeStatic(outer,new Set([inner,core,ring]));mergeStatic(g,new Set([outer,beam]));this.chunks.push({group:g,s:r.s});this.relays.push({group:g,outer,inner,core,beam,ring});
  });
  MEMORIES.forEach((m,i)=>{const g=new THREE.Group();g.position.copy(pathPoint(m.s,m.x,6));const crystal=mesh(new THREE.OctahedronGeometry(2.1,0),emissive(gold,1.6));crystal.scale.y=1.8;g.add(crystal);g.add(mesh(new THREE.TorusGeometry(4,.08,4,24),emissive(gold,.8)));this.scene.add(g);this.memoryMeshes.push(g);});
  this.final=new THREE.Group();this.final.position.copy(pathPoint(7330,0,38));
  for(let i=0;i<3;i++){const r=mesh(new THREE.TorusGeometry(33+i*6,.6,6,96),emissive([cyan,pink,gold][i],1.5));r.rotation.y=i*.7;this.final.add(r);}
  this.finalCore=mesh(new THREE.IcosahedronGeometry(8,1),emissive(gold,1.8));this.final.add(this.finalCore);this.scene.add(this.final);
  // Corruption shoals have visible rotating shards and a pulse-cleared safe radius.
  this.hazards=[];
  [890,1120,2080,2580,2880,4000,4650,4940,6210,6850].forEach((s,i)=>{
   const g=new THREE.Group(),lateral=Math.sin(i*6.1)*42,shardMat=emissive(pink,.9);g.position.copy(pathPoint(s,lateral,3));const pieces=[];
   for(let j=0;j<7;j++){const c=mesh(new THREE.OctahedronGeometry(1+j%3*.5),shardMat,Math.cos(j)*8,2+Math.sin(j*2)*2,Math.sin(j)*8);c.scale.y=2.5;g.add(c);pieces.push(c);}
   const ring=mesh(new THREE.TorusGeometry(13,.13,3,40),emissive(pink,.8));ring.rotation.x=-Math.PI/2;g.add(ring);mergeStatic(g);this.scene.add(g);this.chunks.push({group:g,s});this.hazards.push({s,lateral,group:g,pieces,cleared:false,cooldown:0});
  });
  this.pulse=mesh(new THREE.RingGeometry(.96,1,96),new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));this.pulse.rotation.x=-Math.PI/2;this.pulse.visible=false;this.scene.add(this.pulse);
 }
 makeSkiff(){
  this.skiff=new THREE.Group();this.scene.add(this.skiff);
  const body=new THREE.Group();this.skiff.add(body);this.body=body;
  const ivory=new THREE.MeshStandardMaterial({color:0xa1a9a3,metalness:.65,roughness:.4});
  const orange=new THREE.MeshStandardMaterial({color:0xdb6c3f,metalness:.5,roughness:.42});
  // The hull is a five-station loft with a sharp prow, chine, deck and engine recess.
  const sections=[[-4.8,.06,.15],[-3.3,1.0,.5],[-.5,1.48,.6],[2.1,1.15,.48],[3.5,.8,.27]],v=[],ind=[];
  for(const [z,w,h] of sections){for(const [x,y] of [[-w,0],[-w*.72,-h],[w*.72,-h],[w,0],[w*.7,h*.55],[-w*.7,h*.55]])v.push(x,y,z);}
  for(let j=0;j<sections.length-1;j++)for(let k=0;k<6;k++){const a=j*6+k,b=j*6+(k+1)%6,c=a+6,d=b+6;ind.push(a,b,c,b,d,c);}
  ind.push(24,25,26,24,26,27,24,27,28,24,28,29);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(ind);g.computeVertexNormals();body.add(mesh(g,ivory));
  const deck=mesh(new THREE.BoxGeometry(1.4,.35,2.8),metal,0,.3,.3);body.add(deck);
  const canopy=mesh(new THREE.SphereGeometry(1,16,8,0,TAU,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x08232e,metalness:.85,roughness:.1}),0,.5,-.35);canopy.scale.set(.7,.55,1.4);body.add(canopy);
  body.add(mesh(new THREE.BoxGeometry(.11,.13,3.7),emissive(cyan,1.6),0,.42,-2));
  for(const side of [-1,1]){
   const wingShape=new THREE.Shape();wingShape.moveTo(0,-1.6);wingShape.lineTo(side*2.2,.4);wingShape.lineTo(side*2.7,2.8);wingShape.lineTo(side*.35,1.6);wingShape.closePath();
   const wing=mesh(new THREE.ExtrudeGeometry(wingShape,{depth:.13,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.08,bevelThickness:.07}),orange,side*.9,-.15,0);wing.rotation.x=Math.PI/2;body.add(wing);
   const engine=mesh(new THREE.CylinderGeometry(.45,.6,2.4,12,1,false),metal,side*1.55,0,1.65);engine.rotation.x=Math.PI/2;body.add(engine);
   const ring=mesh(new THREE.TorusGeometry(.43,.07,6,20),ivory,side*1.55,0,2.9);body.add(ring);
   const core=mesh(new THREE.CircleGeometry(.35,16),emissive(cyan,2),side*1.55,0,2.96);body.add(core);
   for(let j=0;j<5;j++)body.add(mesh(new THREE.BoxGeometry(.6,.14,.09),ivory,side*1.55,.43,.7+j*.34));
   body.add(mesh(new THREE.BoxGeometry(.08,.08,3.9),emissive(cyan,1.4),side*1.05,.13,-.6));
   const fin=mesh(new THREE.BoxGeometry(.12,1.15,1.1),orange,side*.66,.65,2.5);fin.rotation.z=side*-.18;body.add(fin);
  }
  // Compact salvage rig, mast, copper conduits and an amber cargo lantern.
  body.add(mesh(new THREE.BoxGeometry(.82,.72,1.1),orange,0,.65,1.9));
  for(let i=0;i<3;i++)body.add(mesh(new THREE.TorusGeometry(.28,.035,4,16),metal,0,.9,1.55+i*.3));
  body.add(mesh(new THREE.CylinderGeometry(.035,.055,2,5),metal,.65,1.2,1.8));
  body.add(mesh(new THREE.SphereGeometry(.12,8,6),emissive(gold,2),.65,2.23,1.8));
  const tail=mesh(new THREE.BoxGeometry(.08,.08,2),emissive(gold),0,.6,2.6);body.add(tail);
  for(const side of [-1,1]){for(let j=0;j<3;j++)body.add(mesh(new THREE.BoxGeometry(.16,.04,.7),ivory,side*2.1,.05,.4+j*.2));}
  this.engineLight=new THREE.PointLight(cyan,13,22,2);this.engineLight.position.set(0,1,3);body.add(this.engineLight);
  this.wake=[];for(let i=0;i<2;i++){const mat=new THREE.MeshBasicMaterial({color:cyan,transparent:true,opacity:.5,depthWrite:false,side:THREE.DoubleSide});const w=mesh(new THREE.PlaneGeometry(.5,18),mat,(i?1:-1)*1.5,-.6,9);w.rotation.x=-Math.PI/2;body.add(w);this.wake.push(w);}mergeStatic(body,new Set(this.wake));
 }
 makeMotes(){
  const r=rng(4),v=[];for(let i=0;i<450;i++)v.push((r()-.5)*700,r()*170,(r()-.5)*900);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));this.motes=new THREE.Points(g,new THREE.PointsMaterial({color:0xffc190,size:.65,transparent:true,opacity:.65,sizeAttenuation:true,depthWrite:false}));this.scene.add(this.motes);
 }
 makePost(){
  const r=this.renderer;this.target=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,depthBuffer:true});
  this.bright=new THREE.WebGLRenderTarget(1,1,{depthBuffer:false});this.blurTarget=new THREE.WebGLRenderTarget(1,1,{depthBuffer:false});
  this.postScene=new THREE.Scene();this.postCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);this.quad=mesh(new THREE.PlaneGeometry(2,2),null);this.postScene.add(this.quad);
  const vertex=`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
  this.blur=new THREE.ShaderMaterial({uniforms:{image:{value:null},direction:{value:new THREE.Vector2()},threshold:{value:0}},vertexShader:vertex,fragmentShader:`varying vec2 vUv;uniform sampler2D image;uniform vec2 direction;uniform float threshold;void main(){vec3 c=texture2D(image,vUv).rgb*.227027;c+=texture2D(image,vUv+direction*1.384615).rgb*.316216;c+=texture2D(image,vUv-direction*1.384615).rgb*.316216;c+=texture2D(image,vUv+direction*3.230769).rgb*.070270;c+=texture2D(image,vUv-direction*3.230769).rgb*.070270;gl_FragColor=vec4(max(vec3(0.),c-threshold),1.);}`});
  this.composite=new THREE.ShaderMaterial({uniforms:{image:{value:this.target.texture},bloom:{value:this.bright.texture},strength:{value:.65},time:{value:0},size:{value:new THREE.Vector2()}},vertexShader:vertex,fragmentShader:`varying vec2 vUv;uniform sampler2D image;uniform sampler2D bloom;uniform float strength;uniform float time;uniform vec2 size;
void main(){vec2 uv=vUv;vec3 col=texture2D(image,uv).rgb+texture2D(bloom,uv).rgb*strength;col=col/(1.+col*.25);col=pow(max(col,vec3(0.)),vec3(.82));float grain=fract(sin(dot(uv*size+time,vec2(12.9898,78.233)))*43758.5453)-.5;col+=grain*.018;float vignette=1.-dot(uv-.5,uv-.5)*.6;col*=vignette;gl_FragColor=vec4(col,1.);}`});
 }
 setQuality(q){this.quality=q;this.pixelRatio=Math.min(window.devicePixelRatio||1,q==='high'?1.75:q==='balanced'?1.2:.8);this.bloom=q!=='low';this.motes.visible=q!=='low';this.motes.geometry.setDrawRange(0,q==='high'?450:260);this.renderer.setPixelRatio(this.pixelRatio);this.resize();}
 resize(){const w=window.innerWidth,h=window.innerHeight;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();const rw=Math.round(w*this.pixelRatio),rh=Math.round(h*this.pixelRatio);this.target.setSize(rw,rh);this.bright.setSize(Math.max(1,rw>>2),Math.max(1,rh>>2));this.blurTarget.setSize(Math.max(1,rw>>2),Math.max(1,rh>>2));this.composite.uniforms.size.value.set(rw,rh);}
 emitPulse(st){this.pulseAge=0;this.pulse.position.copy(pathPoint(st.s,st.lateral,.6));this.pulse.visible=true;}
 project(s,lateral=0,height=22){const p=pathPoint(s,lateral,height);p.project(this.camera);return{x:(p.x*.5+.5)*innerWidth,y:(-.5*p.y+.5)*innerHeight,visible:p.z<1&&p.z>-1&&Math.abs(p.x)<.94&&Math.abs(p.y)<.86};}
 update(st,dt,{attract=false,steer=0,boost=false,reduced=false,ending=0}={}){
  this.clock+=dt;const t=this.clock;shared.time.value=t;shared.dawn.value=ending;shared.release.value=st.ending==='release'?ending:0;
  const s=attract?110:st.s,lateral=attract?-8:st.lateral;const pos=pathPoint(s,lateral,2.4+Math.sin(t*1.8)*.16);
  this.skiff.position.copy(pos);const tangent=Math.atan2(riverX(s+10)-riverX(s),-10);this.skiff.rotation.y=tangent-Math.PI;
  this.body.rotation.z=THREE.MathUtils.damp(this.body.rotation.z,-steer*.13,4,dt);this.body.rotation.x=boost?-.035:Math.sin(t)*.012;
  this.wake.forEach(w=>{w.scale.y=.4+st.speed/25;w.material.opacity=st.speed>1?.22+st.speed*.008:.08;});
  const yaw=this.skiff.rotation.y+(attract?-.38:this.orbit),dist=attract?38:24;
  const desired=pos.clone().add(new THREE.Vector3(Math.sin(yaw)*dist,attract?12:11+this.pitch,Math.cos(yaw)*dist));
  const look=pathPoint(s+(attract?520:100),lateral*.65,attract?30:7);
  if(!this.cameraReady){this.camera.position.copy(desired);this.cameraReady=true;}
  this.camera.position.lerp(desired,1-Math.exp(-dt*3));this.camera.lookAt(look);
  const targetFov=boost?65:58;this.camera.fov=THREE.MathUtils.damp(this.camera.fov,targetFov,2,dt);this.camera.updateProjectionMatrix();
  this.chunks.forEach(c=>{c.group.visible=c.s>s-550&&c.s<s+(this.quality==='low'?2300:this.quality==='high'?3800:3000);});
  this.sky.position.copy(this.camera.position);this.motes.position.copy(pathPoint(s,0,0));this.motes.position.y=(reduced?0:Math.sin(t*.1)*8)+(st.ending==='release'?ending*90:0);
  this.relays.forEach((r,i)=>{r.inner.rotation.y=t*.15;r.core.rotation.y=t*.4;r.core.position.y=Math.sin(t+i)*1.1;r.beam.material.opacity=st.relays[i]?.8:.2+Math.sin(t)*.08;r.outer.rotation.z=reduced?0:Math.sin(t*.3)*.08;r.core.scale.setScalar(st.relays[i]?1.6:1);});
  this.memoryMeshes.forEach((m,i)=>{m.visible=!st.memories.includes(i);m.rotation.y=t*.4;m.position.y=6+Math.sin(t+i)*1.1;});
  this.hazards.forEach(h=>{h.group.visible=!h.cleared&&h.s>s-200&&h.s<s+2000;h.group.rotation.y=t*.13;h.pieces.forEach((p,i)=>{p.rotation.x=t*.4+i;p.rotation.z=t*.2;});if(h.cooldown>0)h.cooldown-=dt;});
  this.final.scale.setScalar(1+(st.ending==='release'?ending*.8:0));this.final.rotation.z=t*.04;this.finalCore.rotation.y=t*.25;
  this.pulseAge+=dt;if(this.pulseAge<2){this.pulse.scale.setScalar(this.pulseAge*80+1);this.pulse.material.opacity=(1-this.pulseAge/2)*.7;}else this.pulse.visible=false;
  const r=this.renderer;if(this.bloom){this.composite.uniforms.strength.value=.65;r.setRenderTarget(this.target);r.render(this.scene,this.camera);
   this.quad.material=this.blur;this.blur.uniforms.image.value=this.target.texture;this.blur.uniforms.threshold.value=.34;this.blur.uniforms.direction.value.set(3/this.target.width,0);r.setRenderTarget(this.bright);r.render(this.postScene,this.postCamera);
   this.blur.uniforms.image.value=this.bright.texture;this.blur.uniforms.threshold.value=0;this.blur.uniforms.direction.value.set(0,2/this.bright.height);r.setRenderTarget(this.blurTarget);r.render(this.postScene,this.postCamera);
   this.blur.uniforms.image.value=this.blurTarget.texture;this.blur.uniforms.direction.value.set(2/this.bright.width,0);r.setRenderTarget(this.bright);r.render(this.postScene,this.postCamera);
   this.quad.material=this.composite;this.composite.uniforms.time.value=t;r.setRenderTarget(null);r.render(this.postScene,this.postCamera);
  }else{r.setRenderTarget(this.target);r.render(this.scene,this.camera);this.quad.material=this.composite;this.composite.uniforms.strength.value=0;this.composite.uniforms.time.value=t;r.setRenderTarget(null);r.render(this.postScene,this.postCamera);}
 }
 resetCamera(){this.orbit=0;this.pitch=0;this.cameraReady=false;}
}
