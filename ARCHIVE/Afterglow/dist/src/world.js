import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { chunkPlan, routeX, rng, station, SIGNALS } from "./course.js";
const vertex = `varying vec3 vWorld; varying vec3 vNormal; void main(){vec4 w=modelMatrix*vec4(position,1.);vWorld=w.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`;
const terrainMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: `varying vec3 vWorld;varying vec3 vNormal;
float hash(vec3 p){return fract(sin(dot(floor(p),vec3(127.1,311.7,74.7)))*43758.5453);}
void main(){vec3 n=normalize(vNormal);vec3 weights=pow(abs(n),vec3(4.));weights/=dot(weights,vec3(1.));
float grain=dot(vec3(hash(vWorld.yzz*1.7),hash(vWorld.xzx*1.7),hash(vWorld.xyy*1.7)),weights);
vec3 col=mix(vec3(.015,.014,.048),vec3(.095,.028,.16),smoothstep(0.,100.,vWorld.y));float light=max(0.,dot(n,normalize(vec3(-.5,.7,-.8))));col+=vec3(.075,.02,.13)*light;col*=.85+grain*.23;
col=mix(col,vec3(.21,.07,.24),smoothstep(600.,1900.,distance(cameraPosition,vWorld))*.65);gl_FragColor=vec4(col,1.);}`,
});
const palmMat = new THREE.MeshStandardMaterial({
  color: 0x0b101c,
  roughness: 1,
  vertexColors: true,
});
const shoreMat = new THREE.MeshBasicMaterial({
  color: 0x9d65c9,
  transparent: true,
  opacity: 0.62,
});
const pinkMat = new THREE.MeshBasicMaterial({ color: 0xff51b4 });
const cyanMat = new THREE.MeshBasicMaterial({ color: 0x7dfff0 });
function geometry(positions, indices, colors) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  if (indices) g.setIndex(indices);
  if (colors)
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}
class Batch {
  constructor() {
    this.pos = [];
    this.idx = [];
    this.col = [];
  }
  add(g, matrix, color) {
    const p = g.attributes.position,
      idx = g.index,
      offset = this.pos.length / 3,
      v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      if (matrix) v.applyMatrix4(matrix);
      this.pos.push(v.x, v.y, v.z);
      if (color) this.col.push(color.r, color.g, color.b);
    }
    if (idx)
      for (let i = 0; i < idx.count; i++) this.idx.push(offset + idx.getX(i));
    else for (let i = 0; i < p.count; i++) this.idx.push(offset + i);
  }
  mesh(mat) {
    return new THREE.Mesh(
      geometry(this.pos, this.idx, this.col.length ? this.col : null),
      mat,
    );
  }
}
function islandGeometry(p, random) {
  const pos = [p.x, p.height, p.z],
    idx = [],
    N = 36,
    R = 7;
  for (let ring = 1; ring <= R; ring++) {
    const r = ring / R;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2,
        wobble = 1 + 0.055 * Math.sin(a * 5 + p.x) + 0.035 * Math.sin(a * 9);
      const h =
        ring === R
          ? -0.8
          : Math.pow(1 - r, 1.4) *
              p.height *
              (0.78 + 0.22 * Math.sin(a * 3 + ring * 0.7)) +
            Math.sin(a * 5) * 3 * (1 - r);
      pos.push(
        p.x + Math.cos(a) * p.rx * r * wobble,
        h,
        p.z + Math.sin(a) * p.rz * r * wobble,
      );
      if (ring === 1) idx.push(0, 1 + ((i + 1) % N), 1 + i);
      else {
        const a0 = 1 + (ring - 2) * N + i,
          b0 = 1 + (ring - 1) * N + i,
          a1 = 1 + (ring - 2) * N + ((i + 1) % N),
          b1 = 1 + (ring - 1) * N + ((i + 1) % N);
        idx.push(a0, b1, b0, a0, a1, b1);
      }
    }
  }
  return geometry(pos, idx);
}
function palmGeometry(height, lean, random) {
  const p = [],
    idx = [],
    C = 7,
    R = 10;
  for (let j = 0; j <= R; j++) {
    const t = j / R,
      r = 0.46 * (1 - t * 0.65);
    for (let i = 0; i < C; i++) {
      const a = (i / C) * Math.PI * 2;
      p.push(Math.cos(a) * r + lean * t * t, height * t, Math.sin(a) * r);
      if (j) {
        const a0 = (j - 1) * C + i,
          b0 = j * C + i,
          a1 = (j - 1) * C + ((i + 1) % C),
          b1 = j * C + ((i + 1) % C);
        idx.push(a0, b0, a1, a1, b0, b1);
      }
    }
  }
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2 + random() * 0.25,
      len = height * (0.35 + random() * 0.16),
      S = 15;
    const base = p.length / 3;
    for (let j = 0; j <= S; j++) {
      const t = j / S,
        d = len * t,
        width = Math.sin(Math.PI * t) ** 0.65 * len * 0.13 * (j % 2 ? 0.6 : 1);
      const y =
        height + Math.sin(t * Math.PI) * len * 0.28 - t * t * len * 0.42;
      for (const s of [-1, 1])
        p.push(
          lean + Math.cos(a) * d + Math.sin(a) * width * s,
          y,
          Math.sin(a) * d - Math.cos(a) * width * s,
        );
      if (j) {
        const n = base + j * 2;
        idx.push(n - 2, n, n - 1, n - 1, n, n + 1);
      }
    }
  }
  return geometry(p, idx);
}
function lineGeometry(p) {
  const N = 70,
    pos = [],
    idx = [];
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2,
      w = 1 + 0.055 * Math.sin(a * 5 + p.x) + 0.035 * Math.sin(a * 9);
    for (const d of [-0.35, 0.35])
      pos.push(
        p.x + Math.cos(a) * (p.rx * w + d),
        0.16,
        p.z + Math.sin(a) * (p.rz * w + d),
      );
    if (i) {
      const k = i * 2;
      idx.push(k - 2, k - 1, k, k - 1, k + 1, k);
    }
  }
  return geometry(pos, idx);
}
function archGeometry(radius = 100) {
  const shape = new THREE.Shape();
  for (let i = 0; i <= 40; i++) {
    const a = (i / 40) * Math.PI;
    const x = Math.cos(a) * (radius + 23),
      y = Math.sin(a) * (radius + 23);
    if (!i) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  for (let i = 40; i >= 0; i--) {
    const a = (i / 40) * Math.PI;
    shape.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
  }
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth: 27,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 3,
    bevelThickness: 3,
    curveSegments: 12,
  });
}
export class World {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.chunks = new Map();
    this.seed = 284;
    this.route = "palms";
    this.quality = "medium";
    this.signalGroups = [];
    this.createSky();
    this.createWater();
    this.createWake();
    this.islands = [];
  }
  createSky() {
    this.sky = new THREE.Mesh(
      new THREE.SphereGeometry(6500, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { time: { value: 0 } },
        vertexShader: `varying vec3 vDir;void main(){vDir=position;gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 vDir;uniform float time;
void main(){vec3 d=normalize(vDir);float h=d.y;vec3 col=mix(vec3(.94,.025,.42),vec3(.29,.025,.43),smoothstep(-.06,.20,h));col=mix(col,vec3(.012,.018,.08),smoothstep(.1,.8,h));
vec3 sun=normalize(vec3(-.08,.12,-1.));float r=length(d-sun);float glow=exp(-r*7.5);col+=vec3(.72,.035,.13)*glow;float disk=1.-smoothstep(.224,.226,r);float yy=(d.y-sun.y)/.225;
float cut=1.;if(yy<-.02){float bands=sin((yy+.02)*70.);float thick=mix(.05,.65,clamp(-yy,0.,1.));cut=step(-thick,bands);}vec3 sc=mix(vec3(1.,.15,.39),vec3(1.,.88,.12),smoothstep(-1.,.35,yy));col=mix(col,sc,disk*cut);
// A faint perspective ceiling, echoing the reference's magenta grid.
if(h>.12){vec2 q=d.xz/max(.12,d.y)*2.5;vec2 f=abs(fract(q+.5)-.5);float line=1.-smoothstep(.006,.018,min(f.x,f.y));col+=vec3(.12,.015,.13)*line*smoothstep(.12,.35,h)*(1.-disk*cut);}
float stars=pow(max(0.,sin(d.x*1831.3)*sin(d.z*2417.1)*sin(d.y*1319.1)),35.);col+=vec3(.26,.31,.5)*stars*smoothstep(.3,.7,h);col*=1.+sin((gl_FragCoord.y)*1.57)*.009;gl_FragColor=vec4(col,1.);}`,
      }),
    );
    this.sky.renderOrder = -10;
    this.sky.frustumCulled = false;
    this.scene.add(this.sky);
  }
  createWater() {
    this.reflection = new THREE.WebGLRenderTarget(768, 432, {
      depthBuffer: true,
    });
    this.reflectCamera = new THREE.PerspectiveCamera();
    this.reflectCamera.up.set(0, -1, 0);
    this.textureMatrix = new THREE.Matrix4();
    this.waterMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mirror: { value: this.reflection.texture },
        textureMatrix: { value: this.textureMatrix },
        useReflection: { value: 1 },
      },
      vertexShader: `uniform float time;uniform mat4 textureMatrix;varying vec3 vWorld;varying vec4 vMirror;
void main(){vec4 w=modelMatrix*vec4(position,1.);vWorld=w.xyz;vMirror=textureMatrix*w;gl_Position=projectionMatrix*viewMatrix*w;}`,
      fragmentShader: `uniform float time;uniform sampler2D mirror;uniform float useReflection;varying vec3 vWorld;varying vec4 vMirror;
float wave(vec2 p){return sin(p.x*.34+p.y*.68+time*1.4)*.42+sin(p.x*.77-p.y*.26+time*.8)*.24+sin(p.x*2.1+p.y*.97-time*1.6)*.13;}
void main(){vec2 p=vWorld.xz;float dist=distance(vWorld,cameraPosition);float w=wave(p);vec3 normal=normalize(vec3(wave(p+vec2(.8,0.))-w,1.7,wave(p+vec2(0.,.8))-w));vec3 eye=normalize(cameraPosition-vWorld);float fres=pow(1.-max(dot(normal,eye),0.),2.);vec2 uv=vMirror.xy/vMirror.w;float fade=min(1.,100./max(dist,1.));uv+=normal.xz*.009*fade;uv.x+=sin(p.y*.7+sin(p.x*.07)*2.+time)*.004*(1.+fade*2.);uv=clamp(uv,.002,.998);vec3 reflectColor=texture2D(mirror,uv).rgb;
vec3 sun=normalize(vec3(-.08,.12,-1.));vec3 ray=reflect(-eye,normal);float along=max(dot(normalize(vec3(eye.x,0.,eye.z)),normalize(vec3(.08,0.,1.))),0.);float horiz=abs(eye.x+.08*eye.z);float shimmer=sin(p.y*1.4+sin(p.x*1.1+time)*1.4+time*1.5)*.5+.5;
float trail=exp(-horiz*horiz*90.)*along*smoothstep(.02,.36,eye.y)*(0.25+.75*pow(shimmer,3.));vec3 base=mix(vec3(.014,.025,.09),vec3(.18,.025,.22),fres);base+=vec3(.035,.016,.08)*w;
vec3 ray2=normalize(vec3(-eye.x+sin(p.y*.8+time)*.025,eye.y,-eye.z));float sr=length(ray2-sun);float disk=1.-smoothstep(.22,.24,sr);float yy=(ray2.y-sun.y)/.225;float bands=yy<-.02?step(-.2,sin((yy+.02)*70.)):1.;vec3 fake=mix(vec3(.045,.018,.14),vec3(.47,.025,.38),(1.-smoothstep(0.,.4,eye.y)));fake=mix(fake,mix(vec3(1.,.17,.4),vec3(1.,.78,.13),smoothstep(-1.,.35,yy)),disk*bands*.8);vec3 col=mix(fake,reflectColor*.92,.78*useReflection);float sunMask=smoothstep(.4,.75,reflectColor.r)*smoothstep(.3,.6,reflectColor.g)*useReflection;float chop=smoothstep(-.5,.6,sin(p.y*1.6+sin(p.x*.45+time)*1.6+time));col=mix(col,mix(base,vec3(.56,.025,.31),.7),sunMask*(1.-chop)*.48);col*=mix(vec3(1.),vec3(1.,.69,1.15),sunMask*(1.-fres));col+=vec3(1.,.24,.07)*trail*.3;
float gridX=1.-smoothstep(.02,.12,abs(mod(p.x+40.,80.)-40.));float gridZ=1.-smoothstep(.02,.12,abs(mod(p.y+40.,80.)-40.));col+=vec3(.04,.03,.10)*max(gridX,gridZ)*(1.-smoothstep(100.,1000.,dist));col=mix(col,vec3(.39,.025,.3),smoothstep(1200.,5000.,dist)*.5);gl_FragColor=vec4(col,1.);}`,
    });
    this.water = new THREE.Mesh(
      new THREE.PlaneGeometry(15000, 15000),
      this.waterMat,
    );
    this.water.rotation.x = -Math.PI / 2;
    this.water.position.y = -0.1;
    this.scene.add(this.water);
  }
  createWake() {
    const N = 120;
    this.wakeN = N;
    this.wakePoints = Array.from({ length: N }, () => ({
      x: 0,
      z: 0,
      w: 0,
      age: 100,
      speed: 0,
      heading: 0,
    }));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(N * 2 * 3), 3),
    );
    geo.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(N * 2 * 3), 3),
    );
    const idx = [];
    for (let i = 1; i < N; i++) {
      const j = i * 2;
      idx.push(j - 2, j, j - 1, j - 1, j, j + 1);
    }
    geo.setIndex(idx);
    this.wake = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    this.wake.frustumCulled = false;
    this.scene.add(this.wake);
    this.wakeTimer = 0;
    const count = 100;
    this.sprayGeo = new THREE.BufferGeometry();
    this.sprayGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    );
    this.sprayGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    );
    this.spray = new THREE.Points(
      this.sprayGeo,
      new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.spray.frustumCulled = false;
    this.scene.add(this.spray);
    this.drops = Array.from({ length: count }, () => ({
      age: 10,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vz: 0,
      vy: 0,
    }));
    this.dropCursor = 0;
  }
  reset(seed, route) {
    this.seed = seed;
    this.route = route;
    for (const chunk of this.chunks.values()) this.disposeChunk(chunk);
    this.chunks.clear();
    for (const g of this.signalGroups) {
      this.scene.remove(g);
      g.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material && ![cyanMat, terrainMaterial].includes(o.material))
          o.material.dispose();
      });
    }
    this.signalGroups = [];
    this.wakePoints.forEach((p) => {
      p.age = 100;
    });
    this.drops.forEach((p) => {
      p.age = 10;
    });
    for (let i = 0; i < SIGNALS.length; i++) this.makeSignal(i);
  }
  makeSignal(i) {
    const s = station(i, this.seed, this.route),
      g = new THREE.Group();
    g.position.set(s.x, 0, s.z);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(13, 0.18, 6, 64),
      cyanMat,
    );
    ring.position.y = 15;
    g.add(ring);
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.6, 90, 6),
      new THREE.MeshBasicMaterial({
        color: 0x79fff2,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      }),
    );
    beam.position.set(0, 55, 0);
    g.add(beam);
    for (const side of [-1, 1]) {
      const buoy = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 1.7, 1.8, 8),
        terrainMaterial,
      );
      buoy.position.set(side * 16, 1, 0);
      g.add(buoy);
      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 6, 5),
        cyanMat,
      );
      mast.position.set(side * 16, 4, 0);
      g.add(mast);
      const cap = new THREE.Mesh(new THREE.OctahedronGeometry(0.7), cyanMat);
      cap.position.set(side * 16, 7.5, 0);
      g.add(cap);
    }
    g.userData = { ring, beam, index: i };
    this.signalGroups.push(g);
    this.scene.add(g);
  }
  makeChunk(index) {
    const plan = chunkPlan(index, this.seed, this.route),
      random = rng(plan.seed),
      g = new THREE.Group(),
      terrain = new Batch(),
      palms = new Batch(),
      shore = new Batch(),
      rocks = new Batch();
    const temp = new THREE.Matrix4(),
      q = new THREE.Quaternion(),
      scale = new THREE.Vector3(1, 1, 1);
    for (const p of plan.islands) {
      terrain.add(islandGeometry(p, random));
      shore.add(lineGeometry(p));
      for (let i = 0; i < p.palms; i++) {
        const a = (p.side < 0 ? 0 : Math.PI) + (random() - 0.5) * 2.7;
        const x = p.x + Math.cos(a) * p.rx * 0.83,
          z = p.z + Math.sin(a) * p.rz * 0.83;
        const dx = (x - p.x) / p.rx,
          dz = (z - p.z) / p.rz,
          y = Math.max(0.5, Math.pow(1 - Math.hypot(dx, dz), 1.4) * p.height);
        const h = 23 + random() * 19;
        const pg = palmGeometry(h, (random() - 0.5) * 4, random);
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), random() * 6.28);
        temp.compose(new THREE.Vector3(x, y, z), q, scale);
        palms.add(
          pg,
          temp,
          new THREE.Color().setRGB(0.45 + random() * 0.15, 0.4, 0.65),
        );
        pg.dispose();
      }
      // Angular basalt crags beyond the palm beaches.
      for (let i = 0; i < 5; i++) {
        const rg = new THREE.IcosahedronGeometry(1, 0);
        q.setFromEuler(new THREE.Euler(random(), random(), random()));
        const x = p.x + p.side * (85 + random() * 75),
          z = p.z + (random() - 0.5) * p.rz;
        temp.compose(
          new THREE.Vector3(x, 15 + random() * 20, z),
          q,
          new THREE.Vector3(
            25 + random() * 40,
            24 + random() * 45,
            40 + random() * 65,
          ),
        );
        terrain.add(rg, temp);
        rg.dispose();
      }
    }
    g.add(
      terrain.mesh(terrainMaterial),
      palms.mesh(palmMat),
      shore.mesh(shoreMat),
    );
    // Recurring monumental arches, alternating with low, illuminated piers.
    if (
      (index % 6 === 0 && index > 1) ||
      (this.route === "arches" && index % 3 === 0 && index > 0)
    ) {
      const az = plan.z,
        ax = routeX(az, this.seed, this.route);
      const arch = new THREE.Mesh(archGeometry(), terrainMaterial);
      arch.position.set(ax, -3, az);
      g.add(arch);
      const pts = [];
      for (let i = 0; i <= 60; i++) {
        const a = (i / 60) * Math.PI;
        pts.push(
          new THREE.Vector3(
            Math.cos(a) * 100 + ax,
            Math.sin(a) * 100 - 2,
            az + 30.3,
          ),
        );
      }
      const trim = new THREE.Mesh(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(pts),
          80,
          0.18,
          4,
          false,
        ),
        this.route === "arches" ? pinkMat : cyanMat,
      );
      g.add(trim);
    }
    if (index % 4 === 2) {
      const p = plan.islands[0],
        x = p.x + p.rx * 0.84;
      for (let i = 0; i < 5; i++) {
        const pier = new THREE.Mesh(
          new THREE.BoxGeometry(4, 0.5, 22),
          terrainMaterial,
        );
        pier.position.set(x + 10, 0.7, p.z + i * 25 - 50);
        g.add(pier);
        const strip = new THREE.Mesh(
          new THREE.BoxGeometry(4, 0.05, 0.1),
          pinkMat,
        );
        strip.position.set(x + 10, 0.98, p.z + i * 25 - 61);
        g.add(strip);
      }
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 1, 38, 5),
        terrainMaterial,
      );
      tower.position.set(x - 10, 20, p.z);
      g.add(tower);
      for (let i = 0; i < 3; i++) {
        const neon = new THREE.Mesh(
          new THREE.TorusGeometry(2.8 + i * 1.5, 0.09, 4, 24),
          pinkMat,
        );
        neon.position.set(x - 10, 29 + i * 3, p.z);
        neon.rotation.x = Math.PI / 2;
        g.add(neon);
      }
    }
    if (this.route === "islands") {
      for (let i = 0; i < 7; i++) {
        const x =
            routeX(plan.z, this.seed, this.route) + (random() - 0.5) * 100,
          z = plan.z + (random() - 0.5) * 400;
        const jelly = new THREE.Mesh(
          new THREE.SphereGeometry(
            1.1 + random(),
            8,
            5,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2,
          ),
          new THREE.MeshBasicMaterial({
            color: i % 2 ? 0xff85d0 : 0x94f8f1,
            transparent: true,
            opacity: 0.6,
          }),
        );
        jelly.position.set(x, 0.3, z);
        g.add(jelly);
      }
    }
    this.scene.add(g);
    this.chunks.set(index, { g, plan });
    return { g, plan };
  }
  disposeChunk(c) {
    this.scene.remove(c.g);
    c.g.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (
        o.material &&
        !["ShaderMaterial"].includes(o.material.type) &&
        ![palmMat, shoreMat, pinkMat, cyanMat].includes(o.material)
      )
        o.material.dispose();
    });
  }
  setQuality(quality) {
    this.quality = quality;
    const sizes = { low: 384, medium: 768, high: 1280 };
    this.reflection.setSize(
      sizes[quality],
      Math.round(sizes[quality] * 0.5625),
    );
    this.waterMat.uniforms.useReflection.value = quality === "low" ? 0 : 1;
    this.spray.visible = quality !== "low";
  }
  update(dt, time, state, craft, activeSignal, free) {
    this.sky.position.copy(
      this.renderer._cameraPosition || new THREE.Vector3(state.x, 0, state.z),
    );
    this.sky.material.uniforms.time.value = time;
    this.water.position.x = state.x;
    this.water.position.z = state.z;
    this.waterMat.uniforms.time.value = time;
    const current = Math.round(-state.z / 600),
      range = this.quality === "low" ? 3 : 4;
    for (let i = current - range; i <= current + range; i++)
      if (!this.chunks.has(i)) this.makeChunk(i);
    for (const [i, c] of this.chunks)
      if (Math.abs(i - current) > range + 1) {
        this.disposeChunk(c);
        this.chunks.delete(i);
      }
    this.islands = [...this.chunks.values()].flatMap((c) => c.plan.islands);
    for (let i = 0; i < this.signalGroups.length; i++) {
      const g = this.signalGroups[i];
      g.visible = !free && i >= activeSignal && i <= activeSignal + 1;
      g.userData.ring.rotation.z = time * 0.05;
      g.userData.ring.scale.setScalar(1 + Math.sin(time * 1.5) * 0.025);
      g.children.forEach((o) => {
        if (o.geometry?.type === "OctahedronGeometry")
          o.rotation.y = time * 0.5;
      });
    }
    this.wakeTimer += dt;
    if (this.wakeTimer > 0.045) {
      this.wakeTimer = 0;
      this.wakePoints.pop();
      this.wakePoints.unshift({
        x: state.x - Math.sin(state.heading) * craft.length * 0.45,
        z: state.z + Math.cos(state.heading) * craft.length * 0.45,
        w: Math.abs(state.speed) > 1 ? craft.beam * 0.4 : 0,
        age: 0,
        heading: state.heading,
        speed: Math.abs(state.speed),
      });
    }
    const wp = this.wake.geometry.attributes.position.array,
      wc = this.wake.geometry.attributes.color.array;
    for (let i = 0; i < this.wakeN; i++) {
      const p = this.wakePoints[i];
      p.age += dt;
      const w = p.w + p.age * p.speed * 0.11,
        fade =
          Math.max(0, 1 - p.age / 5) *
          Math.min(1, p.speed / 20) *
          (p.w ? 1 : 0);
      for (let side = 0; side < 2; side++) {
        const k = (i * 2 + side) * 3,
          s = side ? 1 : -1;
        wp[k] = p.x + Math.cos(p.heading || 0) * w * s;
        wp[k + 1] = 0.025 + Math.sin(time * 2 + p.age * 6) * 0.018;
        wp[k + 2] = p.z + Math.sin(p.heading || 0) * w * s;
        wc[k] = 0.17 * fade;
        wc[k + 1] = 0.5 * fade;
        wc[k + 2] = 0.65 * fade;
      }
    }
    this.wake.geometry.attributes.position.needsUpdate = true;
    this.wake.geometry.attributes.color.needsUpdate = true;
    if (Math.abs(state.speed) > 5) {
      for (let i = 0; i < 2; i++) {
        const d = this.drops[this.dropCursor++ % this.drops.length],
          side = i ? 1 : -1;
        Object.assign(d, {
          age: 0,
          x:
            state.x -
            Math.sin(state.heading) * craft.length * 0.25 +
            Math.cos(state.heading) * side * craft.beam * 0.45,
          z:
            state.z +
            Math.cos(state.heading) * craft.length * 0.25 +
            Math.sin(state.heading) * side * craft.beam * 0.45,
          y: 0.2,
          vx: Math.cos(state.heading) * side * (1 + Math.random() * 2),
          vz: Math.sin(state.heading) * side * (1 + Math.random() * 2),
          vy: Math.random() * 2 + 1,
        });
      }
    }
    const sp = this.sprayGeo.attributes.position.array,
      sc = this.sprayGeo.attributes.color.array;
    this.drops.forEach((d, i) => {
      d.age += dt;
      d.x += d.vx * dt;
      d.z += d.vz * dt;
      d.y += d.vy * dt;
      d.vy -= 5 * dt;
      sp[i * 3] = d.x;
      sp[i * 3 + 1] = d.age < 1 ? Math.max(0, d.y) : -100;
      sp[i * 3 + 2] = d.z;
      const f = Math.max(0, 1 - d.age);
      sc[i * 3] = f * 0.5;
      sc[i * 3 + 1] = f * 0.7;
      sc[i * 3 + 2] = f;
    });
    this.sprayGeo.attributes.position.needsUpdate = true;
    this.sprayGeo.attributes.color.needsUpdate = true;
  }
  renderReflection(camera, target, frame) {
    if (this.quality === "low" || (this.quality === "medium" && frame % 2))
      return;
    const c = this.reflectCamera;
    c.fov = camera.fov;
    c.aspect = camera.aspect;
    c.near = camera.near;
    c.far = camera.far;
    c.position.copy(camera.position);
    c.position.y = -camera.position.y;
    c.up.set(0, -1, 0);
    c.lookAt(target.x, -target.y, target.z);
    c.updateProjectionMatrix();
    c.updateMatrixWorld();
    this.textureMatrix.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1,
    );
    this.textureMatrix
      .multiply(c.projectionMatrix)
      .multiply(c.matrixWorldInverse);
    this.water.visible = false;
    this.wake.visible = false;
    this.spray.visible = false;
    const prev = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.reflection);
    this.renderer.render(this.scene, c);
    this.renderer.setRenderTarget(prev);
    this.water.visible = true;
    this.wake.visible = true;
    this.spray.visible = this.quality !== "low";
  }
}
