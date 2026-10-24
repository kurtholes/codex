import * as T from '../vendor/three.module.js';
export const rand=(()=>{let s=7501;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}})();
export const r=(a,b)=>a+rand()*(b-a);
export function textured(color,scale=.18){const m=new T.MeshStandardMaterial({color,roughness:.85,metalness:.22});m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWorld; varying vec3 vTriNormal;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvec4 wp=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nwp=instanceMatrix*wp;\n#endif\nvWorld=(modelMatrix*wp).xyz; vTriNormal=normalize(mat3(modelMatrix)*objectNormal);');s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 vWorld; varying vec3 vTriNormal;
float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float grain(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1)),f.x),f.y);}`);s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
vec3 wt=pow(abs(vTriNormal),vec3(4));wt/=max(dot(wt,vec3(1)),.001);
vec3 p=vWorld*${scale.toFixed(3)};
float n=dot(vec3(grain(p.yz),grain(p.zx),grain(p.xy)),wt);
float fine=dot(vec3(grain(p.yz*12.),grain(p.zx*12.),grain(p.xy*12.)),wt);
diffuseColor.rgb*=.72+n*.36+fine*.12;`);};return m;}
export class World{
 constructor(scene){this.scene=scene;this.parts=[];this.islands=[];this.factories=[];this.batches=new Map();this.smokestacks=[];this.zeppelins=[];this.turrets=[];
 this.materials={brick:textured(0x48382d),iron:textured(0x263a39),roof:textured(0x35494a),brass:textured(0x97713d),tank:textured(0x8b3d29),stone:textured(0x3b4140,.09),ground:textured(0x565347,.08),window:new T.MeshBasicMaterial({color:0xffbd67}),dark:new T.MeshStandardMaterial({color:0x182827,roughness:.7,metalness:.5})};
 this.geos={box:new T.BoxGeometry(1,1,1),cyl:new T.CylinderGeometry(1,1,1,12),sphere:new T.SphereGeometry(1,12,8),cone:new T.ConeGeometry(1,1,6),torus:new T.TorusGeometry(1,.08,5,16)};
 this.makeSky();this.makeIsland(0,0,-180,125,0);
 for(let i=0;i<23;i++){let a=i*2.399,rr=500+Math.sqrt(i)*430;this.makeIsland(Math.sin(a)*rr,i<8?r(-25,35):i<16?r(95,140):r(210,285),-300+Math.cos(a)*rr,r(95,170),i<8?0:i<16?1:2);}
 this.finalize();this.airships();
 }
 makeSky(){const c=document.createElement('canvas');c.width=256;c.height=256;let ctx=c.getContext('2d');ctx.fillStyle='#555';ctx.fillRect(0,0,256,256);for(let k=0;k<220;k++){let x=r(0,256),y=r(0,256),sz=r(12,50);let grad=ctx.createRadialGradient(x,y,0,x,y,sz);grad.addColorStop(0,'rgba(230,230,230,.12)');grad.addColorStop(1,'rgba(230,230,230,0)');ctx.fillStyle=grad;ctx.fillRect(x-sz,y-sz,sz*2,sz*2);}const cloudMap=new T.CanvasTexture(c);cloudMap.wrapS=cloudMap.wrapT=T.RepeatWrapping;const sky=new T.Mesh(new T.SphereGeometry(9000,32,16),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{clouds:{value:cloudMap}},vertexShader:'varying vec3 vDir; void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D clouds; varying vec3 vDir;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
void main(){vec3 d=normalize(vDir);vec3 sun=normalize(vec3(-.72,.23,-1.));float sd=max(dot(d,sun),0.);vec3 col=mix(vec3(.53,.46,.32),vec3(.12,.22,.25),smoothstep(-.1,.8,d.y));col+=vec3(.64,.37,.12)*pow(sd,14.)+vec3(.95,.64,.28)*pow(sd,130.);col=mix(col,vec3(1.,.84,.53),smoothstep(.999,.9996,sd));vec2 uv=d.xz/max(d.y+.24,.13)*2.3;float n=texture2D(clouds,uv*.07).r;float cloud=smoothstep(.39,.67,n)*smoothstep(-.08,.28,d.y);col=mix(col,vec3(.27,.31,.29)+vec3(.2,.13,.045)*pow(sd,4.),cloud*.65);gl_FragColor=vec4(col,1.);}`}));this.scene.add(sky);this.sky=sky;}
 add(geo,mat,pos,scale,rot=null,part=null){let key=geo+'_'+mat+'_'+(this.currentIsland??'global');let list=this.batches.get(key);if(!list){list=[];this.batches.set(key,list)}let o=new T.Object3D();o.position.copy(pos);o.scale.set(...scale);if(rot)o.rotation.set(...rot);o.updateMatrix();let item={matrix:o.matrix.clone(),part};list.push(item);if(part){part.batchKey=key;part.index=list.length-1;part.pos=pos.clone();part.size=Math.max(...scale)*.6;this.parts.push(part);}return item;}
 box(mat,x,y,z,w,h,d,part=null,rot=null){return this.add('box',mat,new T.Vector3(x,y,z),[w,h,d],rot,part)}
 makeIsland(x,y,z,size,district){let island={x,y,z,size,district,id:this.islands.length};this.islands.push(island);this.currentIsland=island.id;island.detail=[];
 let rock=new T.Mesh(new T.ConeGeometry(size,size*1.2,9,2),this.materials.stone);rock.rotation.z=Math.PI;let at=rock.geometry.attributes.position;for(let j=0;j<at.count;j++){let yy=at.getY(j);if(yy<0){at.setX(j,at.getX(j)*(1+r(-.1,.1)));at.setZ(j,at.getZ(j)*(1+r(-.1,.1)));}}at.needsUpdate=true;rock.geometry.computeVertexNormals();rock.position.set(x,y-size*.58,z);this.scene.add(rock);
 this.add('cyl','ground',new T.Vector3(x,y-1,z),[size,5,size],[0,0,0]);
 // Hanging vertical ribs and engine braces make the islands engineered, not magical rocks.
 for(let k=0;k<7;k++){let a=k/7*Math.PI*2;this.add('cyl','iron',new T.Vector3(x+Math.cos(a)*size*.75,y-14,z+Math.sin(a)*size*.75),[2,32,2]);}
 for(let b=0;b<7;b++){let a=b*2.4;let bx=x+Math.sin(a)*size*.57,bz=z+Math.cos(a)*size*.54;this.factory(bx,y,bz,district,b%3,island);}
 // Harbour gantry, cable pylons and attached landing pier.
 this.box('iron',x-size*.72,y+1,z+size*.67,30,3,90);
 for(let s of [-1,1]){this.box('brass',x+s*size*.78,y+35,z+size*.58,3,70,3);this.box('iron',x+s*size*.78,y+62,z+size*.58,4,3,35);}
 this.box('brass',x,y+69,z+size*.58,size*1.7,3,4);
 for(let k=0;k<4;k++)this.box('window',x-size*.6+k*size*.4,y+66,z+size*.59,2,2,2);
 // Bridges cross the blocks and are breakable in short spans.
 for(let j=-3;j<4;j++)this.box('iron',x+j*14,y+14,z,13,2,8,{hp:30,district,island,kind:'bridge',value:12,dead:false});
 }
 factory(x,y,z,district,type,island){let f={parts:[],x,y,z,island,down:false};this.factories.push(f);let w=r(16,26),d=r(18,30),h=r(14,25)+district*7;
 const part=(kind,hp,val)=>{let p={kind,hp:hp*(1+district*.8),district,value:val*(1+district*2),factory:f,island,dead:false};f.parts.push(p);return p};
 // Four separate walls, roof, load-bearing machinery, and glowing windows.
 this.box('brick',x-w/2,y+h/2,z,2,h,d,part('wall',40,16));this.box('brick',x+w/2,y+h/2,z,2,h,d,part('wall',40,16));
 this.box('brick',x,y+h/2,z-d/2,w,h,2,part('wall',40,16));this.box('brick',x,y+h/2,z+d/2,w,h,2,part('wall',40,16));
 this.box('roof',x,y+h+1,z,w+4,3,d+4,part('roof',30,25));
 for(let side of [-1,1])for(let k=0;k<4;k++)this.box('window',x-w*.34+k*w*.23,y+h*.65,z+side*(d/2+1.1),2.2,4,.2,part('glass',1,2));
 if(type!==1){let cx=x+w*.22,cz=z;for(let j=0;j<4;j++){this.add('cyl','iron',new T.Vector3(cx,y+h+j*9+4,cz),[3.5,9,3.5],null,part('chimney',28,18));this.add('cyl','brass',new T.Vector3(cx,y+h+j*9+8,cz),[3.8,.9,3.8],null,part('band',10,4));}this.smokestacks.push(new T.Vector3(cx,y+h+37,cz));}
 else{this.add('cyl','tank',new T.Vector3(x,y+h+10,z),[w*.44,18,w*.44],null,part('tank',35,70));this.add('sphere','tank',new T.Vector3(x,y+h+19,z),[w*.44,4,w*.44],null,part('tank',25,40));for(let i=0;i<2;i++)this.add('torus','brass',new T.Vector3(x,y+h+5+i*9,z),[w*.45,w*.45,w*.45],[Math.PI/2,0,0],part('band',15,5));}
 // Pressure vessels at ground level: a generous first-shot chain reaction target.
 this.add('sphere','tank',new T.Vector3(x+w*.8,y+7,z+d*.25),[5,7,5],null,part('tank',25,65));
 this.box('brass',x-w*.75,y+3,z,6,6,6,part('machine',30,20));
 if(type===2){let p=part('turret',65,90);this.add('sphere','dark',new T.Vector3(x,y+h+6,z),[5,3,5],null,p);this.box('iron',x,y+h+7,z-6,2,2,10);this.turrets.push(p);}
 }
 finalize(){for(let [key,items]of this.batches){let [g,m,id]=key.split('_');let mesh=new T.InstancedMesh(this.geos[g],this.materials[m],items.length);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);items.forEach((it,i)=>{mesh.setMatrixAt(i,it.matrix);if(it.part)it.part.mesh=mesh});mesh.computeBoundingSphere();this.scene.add(mesh);items.mesh=mesh;if(id!=='global')this.islands[Number(id)].detail.push(mesh);}}
 hide(p){if(p.dead)return;p.dead=true;const m=new T.Matrix4().makeScale(0,0,0);p.mesh.setMatrixAt(p.index,m);p.mesh.instanceMatrix.needsUpdate=true;}
 airships(){for(let i=0;i<6;i++){let g=new T.Group();const env=new T.Mesh(new T.SphereGeometry(1,24,12),this.materials.brass);env.scale.set(20,17,65);g.add(env);for(let j=-2;j<=2;j++){let ring=new T.Mesh(new T.TorusGeometry(1,.018,5,24),this.materials.dark);ring.position.z=j*20;ring.scale.set(20*Math.sqrt(1-(j*.27)**2),17*Math.sqrt(1-(j*.27)**2),1);g.add(ring);}let keel=new T.Mesh(new T.BoxGeometry(10,8,35),this.materials.dark);keel.position.y=-21;g.add(keel);g.position.set(r(-2000,2000),r(180,360),r(-2400,1500));this.scene.add(g);this.zeppelins.push(g);}}
 updateLOD(pos,quality){let distance=quality==='low'?650:quality==='medium'?1050:1500;for(let isl of this.islands){let near=Math.hypot(pos.x-isl.x,pos.z-isl.z)<distance;for(let mesh of isl.detail)mesh.visible=near;if(!isl.proxy){let verts=[];const add=(geo,x,y,z)=>{let g=geo.toNonIndexed();g.translate(x,y,z);verts.push(...g.attributes.position.array);g.dispose();};for(let k=0;k<7;k++){let a=k*2.4,x=isl.x+Math.sin(a)*isl.size*.57,z=isl.z+Math.cos(a)*isl.size*.54;add(new T.BoxGeometry(22,22,24),x,isl.y+11,z);add(new T.CylinderGeometry(3.5,3.5,35,6),x,isl.y+38,z);}let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.computeVertexNormals();isl.proxy=new T.Mesh(g,new T.MeshLambertMaterial({color:0x3b4541}));this.scene.add(isl.proxy);}isl.proxy.visible=!near;} }
 nearest(pos){return this.islands.reduce((a,b)=>Math.hypot(pos.x-a.x,pos.z-a.z)<Math.hypot(pos.x-b.x,pos.z-b.z)?a:b);}
 reset(){for(let p of this.parts){p.dead=false;p.hp=p.kind==='tank'?25:p.kind==='glass'?1:40;p.hp*=1+p.district*.8;let items=this.batches.get(p.batchKey);p.mesh.setMatrixAt(p.index,items[p.index].matrix);p.mesh.instanceMatrix.needsUpdate=true;}for(let f of this.factories)f.down=false;}
}
