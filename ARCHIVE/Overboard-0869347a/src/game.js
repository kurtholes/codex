import * as T from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
const $ = (id) => document.getElementById(id),
  TAU = Math.PI * 2;
const renderer = new T.WebGLRenderer({
  canvas: $("sea"),
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = T.SRGBColorSpace;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;
const scene = new T.Scene();
scene.fog = new T.FogExp2(0xba8c4f, 0.0038);
const camera = new T.PerspectiveCamera(57, innerWidth / innerHeight, 0.1, 2400);
scene.add(new T.HemisphereLight(0xffe6b0, 0x55452e, 2));
const sun = new T.DirectionalLight(0xffcf80, 3);
sun.position.set(-180, 95, -300);
scene.add(sun);
const mats = {};
for (const [k, c] of Object.entries({
  wood: 0x695039,
  edge: 0xa8824a,
  rope: 0xc5aa79,
  dark: 0x322d25,
  cloth: 0xccb680,
  skin: 0x9c744e,
  metal: 0x555341,
}))
  mats[k] = new T.MeshStandardMaterial({ color: c, roughness: 0.86 });
mats.cloth.side = T.DoubleSide;
function grain(mat, scale = 1) {
  mat.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vg; varying vec3 ng;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvg=(modelMatrix*vec4(position,1.)).xyz; ng=normalize(mat3(modelMatrix)*normal);",
      );
    s.fragmentShader = s.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vg; varying vec3 ng;\nfloat pat(vec2 p){return sin(p.x*18.+sin(p.y*2.)*2.)*.5+.5;}",
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>\nvec3 w=pow(abs(ng),vec3(4.));w/=max(.001,w.x+w.y+w.z);vec3 p=vg*${scale.toFixed(2)};float g=pat(p.yz)*w.x+pat(p.xz)*w.y+pat(p.xy)*w.z;diffuseColor.rgb*=.78+.3*g;`,
      );
  };
  return mat;
}
grain(mats.wood, 1.4);
grain(mats.edge, 1.2);
function mesh(g, m, p, x = 0, y = 0, z = 0) {
  let a = new T.Mesh(g, m);
  a.position.set(x, y, z);
  p.add(a);
  return a;
}
function box(p, w, h, d, m, x = 0, y = 0, z = 0) {
  return mesh(new T.BoxGeometry(w, h, d), m, p, x, y, z);
}
function sphere(p, r, m, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) {
  let a = mesh(new T.SphereGeometry(r, 14, 10), m, p, x, y, z);
  a.scale.set(sx, sy, sz);
  return a;
}
function rod(p, a, b, r, m) {
  let av = new T.Vector3(...a),
    bv = new T.Vector3(...b),
    ob = mesh(new T.CylinderGeometry(r, r, av.distanceTo(bv), 8), m, p);
  ob.position.copy(av.clone().add(bv).multiplyScalar(0.5));
  ob.quaternion.setFromUnitVectors(
    new T.Vector3(0, 1, 0),
    bv.sub(av).normalize(),
  );
  return ob;
}
// Ring-lofted anatomy gives the vest shoulders, waist, and irregular fabric folds.
function loftBody() {
  const rings = [
      [-0.53, 0.12, 0.09],
      [-0.35, 0.34, 0.18],
      [-0.1, 0.32, 0.23],
      [0.25, 0.24, 0.18],
      [0.48, 0.16, 0.11],
    ],
    v = [],
    indices = [],
    n = 20;
  for (let j = 0; j < rings.length; j++) {
    let [z, rx, ry] = rings[j];
    for (let i = 0; i < n; i++) {
      let a = (i / n) * TAU,
        fold = 1 + Math.sin(i * 3 + j) * 0.035;
      v.push(Math.cos(a) * rx * fold, 0.12 + Math.sin(a) * ry * fold, z);
    }
  }
  for (let j = 0; j < rings.length - 1; j++)
    for (let i = 0; i < n; i++) {
      let a = j * n + i,
        b = j * n + ((i + 1) % n);
      indices.push(a, b, a + n, b, b + n, a + n);
    }
  for (let j of [0, rings.length - 1])
    for (let i = 1; i < n - 1; i++)
      indices.push(j * n, j * n + i, j * n + i + 1);
  let g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(v, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}
let weather = 1;
const wave = (x, z, t) =>
  weather *
  (Math.sin(x * 0.065 + z * 0.025 + t * 0.77) * 2.4 +
    Math.sin(z * 0.11 - x * 0.022 + t * 1.08) * 0.95 +
    Math.sin(x * 0.19 + z * 0.15 + t * 1.55) * 0.22);
let time = 0;
const uniforms = {
  uTime: { value: 0 },
  uWeather: { value: 1 },
  uCenter: { value: new T.Vector2() },
};
const oceanMat = new T.ShaderMaterial({
  uniforms,
  side: T.DoubleSide,
  vertexShader: `uniform float uTime;uniform float uWeather;uniform vec2 uCenter;varying vec3 vWorld;varying vec3 vN;float wave(vec2 p){return uWeather*(sin(p.x*.065+p.y*.025+uTime*.77)*2.4+sin(p.y*.11-p.x*.022+uTime*1.08)*.95+sin(p.x*.19+p.y*.15+uTime*1.55)*.22);}void main(){vec3 p=position;p.xz+=uCenter;p.y=wave(p.xz);float e=.3;vN=normalize(vec3(wave(p.xz-vec2(e,0.))-wave(p.xz+vec2(e,0.)),2.*e,wave(p.xz-vec2(0.,e))-wave(p.xz+vec2(0.,e))));vWorld=p;gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`,
  fragmentShader: `uniform float uTime;varying vec3 vWorld;varying vec3 vN;float grain(vec2 p){return sin(p.x*3.+sin(p.y*5.))*sin(p.y*7.+uTime)*.5+.5;}void main(){vec3 n=normalize(vN);
#ifndef LOW_SEA
n=normalize(vN+vec3(sin(vWorld.z*2.+uTime)*.022,0.,sin(vWorld.x*2.3-uTime)*.022));
#endif
vec3 eye=normalize(cameraPosition-vWorld);vec3 light=normalize(vec3(-.16,.10,-.98));float fres=pow(1.-max(dot(n,eye),0.),3.);float spec=pow(max(dot(reflect(-light,n),eye),0.),100.);float glow=pow(max(dot(reflect(-light,n),eye),0.),8.);vec3 w=pow(abs(n),vec3(4.));w/=w.x+w.y+w.z;float tri=.5;
#ifndef LOW_SEA
tri=grain(vWorld.yz)*w.x+grain(vWorld.xz)*w.y+grain(vWorld.xy)*w.z;
#endif
vec3 c=mix(vec3(.065,.043,.025),vec3(.29,.17,.055),clamp(n.y*.35+fres*.6+vWorld.y*.055,0.,1.));c+=vec3(1.,.65,.25)*(spec*2.1+glow*.20);c+=tri*.009;float foam=smoothstep(2.05,2.5,vWorld.y)*smoothstep(.83,.97,tri);c=mix(c,vec3(.85,.69,.4),foam*.6);float fog=1.-exp(-length(cameraPosition-vWorld)*.0038);c=mix(c,vec3(.53,.32,.12),fog);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`,
});
let ocean;
function seaGeometry(n) {
  if (ocean) {
    scene.remove(ocean);
    ocean.geometry.dispose();
  }
  let g = new T.PlaneGeometry(2, 2, n, n);
  g.rotateX(-Math.PI / 2);
  let pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i),
      z = pos.getZ(i);
    pos.setXYZ(i, Math.sign(x) * x * x * 1100, 0, Math.sign(z) * z * z * 1100);
  }
  ocean = new T.Mesh(g, oceanMat);
  ocean.frustumCulled = false;
  scene.add(ocean);
}
const skyMat = new T.ShaderMaterial({
  side: T.BackSide,
  depthWrite: false,
  vertexShader:
    "varying vec3 vDir;void main(){vDir=position;gl_Position=projectionMatrix*viewMatrix*vec4(position+cameraPosition,1.);}",
  fragmentShader: `varying vec3 vDir;void main(){vec3 d=normalize(vDir);float h=max(d.y,0.);vec3 c=mix(vec3(.72,.43,.15),vec3(.24,.21,.16),pow(h,.55));vec3 s=normalize(vec3(-.16,.10,-.98));float a=max(dot(d,s),0.);c+=vec3(1.,.72,.33)*pow(a,18.)*.5;c+=vec3(1.,.86,.53)*smoothstep(.9991,.9997,a)*2.;float cloud=sin(d.x*18.+sin(d.z*24.))*sin(d.z*34.+d.y*15.);c+=cloud*.027*smoothstep(.02,.3,d.y);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`,
});
const sky = new T.Mesh(new T.SphereGeometry(1700, 40, 24), skyMat);
scene.add(sky);
const mistGeo = new T.BufferGeometry(),
  mistPositions = new Float32Array(80 * 3);
for (let i = 0; i < 80; i++) {
  mistPositions[i * 3] = (Math.random() - 0.5) * 500;
  mistPositions[i * 3 + 1] = Math.random() * 5;
  mistPositions[i * 3 + 2] = (Math.random() - 0.5) * 500;
}
mistGeo.setAttribute("position", new T.BufferAttribute(mistPositions, 3));
const mist = new T.Points(
  mistGeo,
  new T.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: T.AdditiveBlending,
    uniforms: { uTime: uniforms.uTime },
    vertexShader:
      "uniform float uTime;void main(){vec3 p=position;p.x+=sin(uTime*.1+p.z)*5.;vec4 v=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*v;gl_PointSize=min(180.,1600./max(1.,-v.z));}",
    fragmentShader:
      "void main(){float r=length(gl_PointCoord-.5)*2.;float a=pow(max(0.,1.-r),2.)*.10;gl_FragColor=vec4(.9,.62,.24,a);}",
  }),
);
mist.frustumCulled = false;
scene.add(mist);
const swimmer = new T.Group();
scene.add(swimmer);
mesh(loftBody(), mats.dark, swimmer);
sphere(swimmer, 0.23, mats.skin, 0, 0.44, -0.38, 0.85, 1.05, 1);
sphere(swimmer, 0.24, mats.dark, 0, 0.54, -0.35, 0.9, 0.65, 1);
sphere(swimmer, 0.12, mats.skin, 0, 0.43, -0.57, 1, 0.7, 0.5);
for (let side of [-1, 1]) {
  sphere(swimmer, 0.055, mats.skin, side * 0.2, 0.44, -0.38, 0.7, 1.3, 0.7);
  sphere(swimmer, 0.026, mats.dark, side * 0.09, 0.47, -0.565, 1, 1, 0.5);
  rod(
    swimmer,
    [side * 0.24, 0.29, -0.32],
    [side * 0.14, 0.25, 0.34],
    0.018,
    mats.rope,
  );
  for (let i = 0; i < 5; i++)
    box(
      swimmer,
      0.026,
      0.008,
      0.013,
      mats.edge,
      side * 0.22,
      0.305,
      -0.2 + i * 0.07,
    );
}
const arms = [],
  legs = [];
for (let s of [-1, 1]) {
  let a = new T.Group();
  a.position.set(s * 0.3, 0.18, -0.18);
  swimmer.add(a);
  sphere(a, 0.105, mats.skin, 0, 0, 0.31, 0.9, 1, 3.5);
  sphere(a, 0.09, mats.skin, 0, -0.03, 0.65, 1, 0.7, 1.4);
  arms.push(a);
  let l = new T.Group();
  l.position.set(s * 0.15, 0.02, 0.37);
  swimmer.add(l);
  sphere(l, 0.12, mats.dark, 0, 0, 0.25, 1, 1, 2.8);
  sphere(l, 0.08, mats.skin, 0, 0, 0.55, 1, 1, 2);
  legs.push(l);
}
rod(swimmer, [-0.24, 0.3, 0.12], [0.24, 0.3, 0.12], 0.045, mats.rope);
batchGroup(swimmer);
let saved;
try {
  saved = JSON.parse(localStorage.getItem("overboard-save-v1"));
} catch {}
const emptyLevels = () => ({
  hull: 0,
  fins: 0,
  sail: 0,
  hold: 0,
  work: 0,
  depth: 0,
});
const state = {
  mode: "voyage",
  wood: Math.max(0, Number(saved?.wood) || 0),
  levels: { ...emptyLevels(), ...saved?.levels },
  x: 0,
  z: 0,
  stamina: 100,
  exposure: 0,
  aboard: false,
  active: true,
  elapsed: 0,
  total: 0,
  grabs: 0,
  breaks: 0,
  firstAction: null,
  upgrades: 0,
  weather: 1,
};
for (let k in state.levels)
  state.levels[k] = Math.max(0, Math.min(5, Number(state.levels[k]) || 0));
const raft = new T.Group();
scene.add(raft);
let raftPos = new T.Vector2(0, -13),
  raftAngle = 0;
function batchGroup(group) {
  const buckets = new Map();
  for (let c of [...group.children])
    if (c.isMesh) {
      c.updateMatrix();
      let list = buckets.get(c.material) || [];
      list.push(c);
      buckets.set(c.material, list);
    }
  for (let [mat, list] of buckets) {
    if (list.length < 2) continue;
    let positions = [],
      normals = [],
      uvs = [];
    for (let ob of list) {
      let g = ob.geometry.index
        ? ob.geometry.toNonIndexed()
        : ob.geometry.clone();
      g.applyMatrix4(ob.matrix);
      positions.push(...g.attributes.position.array);
      normals.push(...g.attributes.normal.array);
      if (g.attributes.uv) uvs.push(...g.attributes.uv.array);
      else uvs.push(...new Float32Array(g.attributes.position.count * 2));
      g.dispose();
      group.remove(ob);
      ob.geometry.dispose();
    }
    let g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
    g.setAttribute("normal", new T.Float32BufferAttribute(normals, 3));
    if (uvs.length) g.setAttribute("uv", new T.Float32BufferAttribute(uvs, 2));
    mesh(g, mat, group);
  }
}
function clearGroup(g) {
  for (let c of [...g.children]) {
    g.remove(c);
    c.traverse((o) => o.geometry?.dispose());
  }
}
function buildRaft() {
  clearGroup(raft);
  let h = state.levels.hull,
    width = 2.4 + h * 0.8,
    length = 3 + h * 0.65;
  for (let i = 0; i < 7 + h * 2; i++) {
    let x = -width / 2 + ((i + 0.5) * width) / (7 + h * 2);
    box(raft, width / (7 + h * 2) - 0.035, 0.18, length, mats.wood, x, 0.2, 0);
    for (let z of [-length * 0.34, length * 0.34])
      box(raft, 0.07, 0.24, 0.17, mats.rope, x, 0.22, z);
  }
  for (let x of [-width * 0.35, width * 0.35])
    rod(
      raft,
      [x, -0.1, -length * 0.45],
      [x, -0.1, length * 0.45],
      0.24,
      mats.edge,
    );
  for (let z of [-length * 0.33, length * 0.33])
    box(raft, width + 0.25, 0.17, 0.18, mats.dark, 0, 0.02, z);
  if (h) {
    for (let x of [-width * 0.49, width * 0.49])
      for (let z of [-length * 0.43, length * 0.43])
        rod(raft, [x, 0.2, z], [x, 0.95, z], 0.055, mats.edge);
    rod(
      raft,
      [-width * 0.49, 0.75, length * 0.43],
      [width * 0.49, 0.75, length * 0.43],
      0.035,
      mats.rope,
    );
  }
  let sail = state.levels.sail;
  if (sail) {
    rod(raft, [0, 0.2, 0], [0, 3.8 + sail * 0.65, 0], 0.085, mats.edge);
    rod(
      raft,
      [-1 - sail * 0.3, 3.1 + sail * 0.4, 0],
      [1 + sail * 0.3, 3.1 + sail * 0.4, 0],
      0.055,
      mats.edge,
    );
    let g = new T.PlaneGeometry(2 + sail * 0.6, 2 + sail * 0.45, 10, 10),
      p = g.attributes.position;
    for (let i = 0; i < p.count; i++)
      p.setZ(
        i,
        Math.sin((p.getX(i) / (2 + sail * 0.6) + 0.5) * Math.PI) * 0.42,
      );
    g.computeVertexNormals();
    mesh(g, mats.cloth, raft, 0, 2.2 + sail * 0.35, 0.05);
    for (let s of [-1, 1])
      rod(
        raft,
        [0, 3.8 + sail * 0.65, 0],
        [s * width * 0.45, 0.3, length * 0.4],
        0.018,
        mats.rope,
      );
  }
  for (let i = 0; i < state.levels.hold + 1; i++) {
    let x = (i % 2 ? 1 : -1) * width * 0.33,
      z = length * 0.22 - Math.floor(i / 2) * 0.65;
    mesh(
      new T.CylinderGeometry(0.27, 0.28, 0.65, 12),
      mats.wood,
      raft,
      x,
      0.58,
      z,
    );
    for (let y of [0.35, 0.75])
      mesh(
        new T.TorusGeometry(0.28, 0.025, 4, 12),
        mats.dark,
        raft,
        x,
        y,
        z,
      ).rotation.x = Math.PI / 2;
  }
  if (state.levels.work) {
    let g = new T.Group();
    g.position.set(width * 0.32, 1.6, length * 0.29);
    raft.add(g);
    rod(g, [0, -1.3, 0], [0, 0.8, 0], 0.05, mats.dark);
    let fan = new T.Group();
    g.add(fan);
    for (let i = 0; i < 4; i++) {
      let a = (i * Math.PI) / 2,
        b = box(
          fan,
          0.18,
          1.1,
          0.07,
          mats.cloth,
          Math.sin(-a) * 0.48,
          Math.cos(a) * 0.48,
          0,
        );
      b.rotation.z = a;
    }
    fan.scale.setScalar(0.8 + state.levels.work * 0.15);
    g.userData.fan = fan;
    box(raft, 1, 0.2, 1, mats.metal, width * 0.3, 0.4, length * 0.3);
  }
  if (state.levels.depth) {
    sphere(raft, 0.5, mats.edge, -width * 0.33, 0.65, -length * 0.2, 1, 1.2, 1);
    mesh(
      new T.TorusGeometry(0.26, 0.055, 6, 16),
      mats.dark,
      raft,
      -width * 0.33,
      0.7,
      -length * 0.2 - 0.44,
    );
    sphere(
      raft,
      0.21,
      new T.MeshStandardMaterial({
        color: 0x8ca99c,
        metalness: 0.7,
        roughness: 0.15,
      }),
      -width * 0.33,
      0.7,
      -length * 0.2 - 0.44,
    );
    if (state.levels.depth >= 4)
      sphere(raft, 0.5, mats.edge, width * 0.35, 0.5, -length * 0.2, 1, 1, 2.5);
  }
  batchGroup(raft);
}
const dummy = new T.Object3D(),
  items = [],
  wrecks = [];
const itemMesh = new T.InstancedMesh(
  new T.BoxGeometry(0.65, 0.38, 1.15),
  mats.edge,
  280,
);
itemMesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
itemMesh.frustumCulled = false;
scene.add(itemMesh);
let seed = Math.random() * 10000;
function rand() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
function addItem(x, z, value = 3) {
  let a = { x, z, value, active: true, phase: rand() * TAU };
  if (items.length < 280) items.push(a);
  else {
    let old = items.find((i) => !i.active);
    if (old) Object.assign(old, a);
  }
}
function createWreck(x, z, size = 1) {
  // Keep hulls reachable: reef boulders fill each landmark's central envelope.
  for (let r of regions)
    if (Math.hypot(x - r.x, z - r.z) < r.r + 45) x = r.x + r.r + 90;

  let g = new T.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rand() * TAU;
  scene.add(g);
  for (let side of [-1, 1])
    for (let j = 0; j < 8; j++) {
      let p = box(
        g,
        0.18,
        1.3,
        1.8,
        mats.wood,
        side * (1.5 - Math.abs(j - 3.5) * 0.12) * size,
        (rand() - 0.5) * 0.5,
        (j - 3.5) * 1.45 * size,
      );
      p.rotation.z = side * 0.25;
      p.rotation.x = (rand() - 0.5) * 0.2;
    }
  for (let j = 0; j < 5; j++)
    box(g, 2.8 * size, 0.16, 0.65, mats.edge, 0, -0.5, (j - 2) * 1.8 * size);
  rod(g, [0, -0.4, -1], [0.3, 4.5 * size, -1.5], 0.11, mats.dark);
  rod(g, [0.3, 3, -1.4], [2, 3, -1.4], 0.07, mats.edge);
  mesh(new T.PlaneGeometry(1.5, 2), mats.cloth, g, 1.1, 2, -1.4).rotation.z =
    0.2;
  batchGroup(g);
  const deep = new T.Group();
  deep.position.set(x, -5, z);
  deep.rotation.y = g.rotation.y;
  scene.add(deep);
  for (let j = 0; j < 6; j++) {
    let rib = mesh(
      new T.TorusGeometry(2, 0.1, 5, 10, Math.PI * 1.6),
      mats.dark,
      deep,
      0,
      0.2,
      (j - 2.5) * 1.4,
    );
    rib.rotation.z = 0.2;
  }
  for (let side of [-1, 1])
    for (let j = 0; j < 3; j++)
      box(deep, 0.15, 0.3, 8, mats.wood, side * 1.8, -1 + j * 0.6, 0);
  for (let i = 0; i < 7; i++)
    box(deep, 0.5, 0.13, 8, mats.wood, (i - 3) * 0.5, -1.5, 0);
  batchGroup(deep);
  let treasure = new T.Group();
  deep.add(treasure);
  box(treasure, 0.9, 0.65, 0.7, mats.edge, 0, -1, 0);
  for (let z of [-0.22, 0.22])
    box(treasure, 0.96, 0.7, 0.045, mats.rope, 0, -1, z);
  deep.visible = false;
  wrecks.push({
    g,
    deep,
    treasure,
    x,
    z,
    hp: 3 + Math.floor(size * 2),
    alive: true,
    size,
  });
}
const rockmat = grain(
    new T.MeshStandardMaterial({ color: 0x504a39, roughness: 1 }),
    0.6,
  ),
  regions = [
    { x: -190, z: -230, name: "The Quiet Shoals", r: 100 },
    { x: 220, z: -390, name: "The Ship Graveyard", r: 140 },
    { x: -380, z: -650, name: "The Storm Belt", r: 170 },
    { x: 390, z: -850, name: "Ember Shallows", r: 180 },
  ];
for (let r of regions)
  for (let i = 0; i < 13; i++) {
    let a = rand() * TAU,
      rr = 30 + rand() * 55,
      rock = mesh(
        new T.IcosahedronGeometry(1, 1),
        rockmat,
        scene,
        r.x + Math.cos(a) * rr,
        -2,
        r.z + Math.sin(a) * rr,
      );
    rock.scale.set(5 + rand() * 15, 3 + rand() * 13, 6 + rand() * 12);
    rock.rotation.set(rand(), rand(), rand());
    rock.userData.reef = true;
  }
const rescueShip = new T.Group();
scene.add(rescueShip);
box(rescueShip, 7, 3, 27, mats.dark, 0, 0.5, 0);
sphere(rescueShip, 1, mats.dark, 0, 0.5, -13, 3.5, 1.5, 5);
box(rescueShip, 6, 0.5, 20, mats.edge, 0, 2.2, 1);
box(rescueShip, 4, 3, 5, mats.cloth, 0, 3.8, 3);
box(rescueShip, 1, 4, 1, mats.dark, 0, 5, 4);
for (let x of [-1, 1]) {
  for (let z of [-10, -5, 0, 7, 11])
    rod(rescueShip, [x * 3, 2.5, z], [x * 3, 3.4, z], 0.045, mats.edge);
  rod(rescueShip, [x * 3, 3.4, -10], [x * 3, 3.4, 11], 0.025, mats.rope);
}
rod(rescueShip, [0, 2, -6], [0, 8, -6], 0.08, mats.edge);
box(rescueShip, 2, 1, 0.05, mats.cloth, 1, 7, -6);
const particleCount = 220,
  particleMesh = new T.InstancedMesh(
    new T.BoxGeometry(0.065, 0.035, 0.17),
    new T.MeshBasicMaterial({ color: 0xffdfa2 }),
    particleCount,
  );
particleMesh.frustumCulled = false;
scene.add(particleMesh);
const particles = Array.from({ length: particleCount }, () => ({
  life: 0,
  x: 0,
  y: -100,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0,
}));
let particleCursor = 0;
function burst(x, y, z, n = 25, power = 1) {
  for (let i = 0; i < n; i++)
    Object.assign(particles[particleCursor++ % particleCount], {
      life: 0.7 + rand() * 0.7,
      x,
      y,
      z,
      vx: (rand() - 0.5) * 5 * power,
      vy: rand() * 4 * power,
      vz: (rand() - 0.5) * 5 * power,
    });
}
let audio,
  muted = false,
  surfAudio;
function sound(f = 300, d = 0.13, type = "sine", v = 0.1) {
  if (muted) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
    let o = audio.createOscillator(),
      g = audio.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, audio.currentTime);
    o.frequency.exponentialRampToValueAtTime(f * 0.45, audio.currentTime + d);
    g.gain.setValueAtTime(v, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + d);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + d);
  } catch {}
}
function startSurf() {
  if (surfAudio || muted) return;
  try {
    sound(80, 0.01, "sine", 0.001);
    let n = audio.createBuffer(1, audio.sampleRate * 3, audio.sampleRate),
      d = n.getChannelData(0),
      last = 0;
    for (let i = 0; i < d.length; i++) {
      last = (last + (Math.random() * 2 - 1) * 0.025) / 1.025;
      d[i] = last * 4;
    }
    let src = audio.createBufferSource();
    src.buffer = n;
    src.loop = true;
    let f = audio.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 700;
    let g = audio.createGain();
    g.gain.value = 0.22;
    src.connect(f).connect(g).connect(audio.destination);
    src.start();
    surfAudio = g;
  } catch {}
}
const disciplines = [
  {
    key: "hull",
    icon: "▱",
    name: "Lashings",
    desc: [
      "Wider deck",
      "Braced hull",
      "Articulated hull",
      "Storm frame",
      "Sea fortress",
    ],
  },
  {
    key: "fins",
    icon: "≋",
    name: "Swimcraft",
    desc: [
      "Swim fins",
      "Crest rider",
      "Dolphin surge",
      "Wave runner",
      "Ocean stride",
    ],
  },
  {
    key: "sail",
    icon: "◭",
    name: "Rigging",
    desc: [
      "Deploy sail",
      "Running rig",
      "Twin sheets",
      "Storm canvas",
      "Wing sail",
    ],
  },
  {
    key: "hold",
    icon: "▥",
    name: "Voyage hold",
    desc: [
      "Dry barrels",
      "Towline",
      "Waterproof hold",
      "Insulated deck",
      "Endless stores",
    ],
  },
  {
    key: "work",
    icon: "✣",
    name: "Wind workshop",
    desc: [
      "Wind spindle",
      "Salvage winch",
      "Reinforced bow",
      "Powered mill",
      "Wreck breaker",
    ],
  },
  {
    key: "depth",
    icon: "⊙",
    name: "Deepwater",
    desc: [
      "Diving bell",
      "Reef reach",
      "Wreck diver",
      "Compact sub",
      "Abyss drive",
    ],
  },
];
const ripple = new T.Mesh(
  new T.RingGeometry(0.6, 1.6, 40),
  new T.MeshBasicMaterial({
    color: 0xe6c78a,
    transparent: true,
    opacity: 0.16,
    side: T.DoubleSide,
    depthWrite: false,
  }),
);
ripple.rotation.x = -Math.PI / 2;
scene.add(ripple);
const cargo = new T.InstancedMesh(
  new T.BoxGeometry(0.3, 0.25, 0.7),
  mats.edge,
  24,
);
cargo.frustumCulled = false;
scene.add(cargo);
const sub = new T.Group();
scene.add(sub);
sphere(sub, 0.5, mats.edge, 0, 0, 0, 1, 1, 2.3);
sphere(sub, 0.3, mats.dark, 0, 0.27, -0.6, 1, 1, 0.9);
mesh(new T.TorusGeometry(0.3, 0.045, 6, 18), mats.rope, sub, 0, 0.27, -0.87);
rod(sub, [0, 0.4, 0], [0, 1, 0], 0.05, mats.dark);
rod(sub, [0, 1, 0], [0, 1, -0.3], 0.05, mats.dark);
for (let x of [-0.65, 0.65]) box(sub, 0.5, 0.06, 0.6, mats.metal, x, 0, 0.5);
const prop = box(sub, 0.8, 0.08, 0.08, mats.dark, 0, 0, 1.2);
batchGroup(sub);
let diveBlend = 0,
  workTimer = 0,
  spawnTimer = 0;
const beacon = document.createElement("div");
beacon.id = "beacon";
document.body.append(beacon);
let sessionStart = performance.now(),
  yaw = 0,
  heading = 0,
  shake = 0,
  hitPause = 0,
  ramCooldown = 0,
  toastTimer = 0,
  saveTimer = 0,
  strokeTimer = 0,
  autoQuality = true,
  quality = "medium",
  nearest = null,
  region = "The Amber Reach";
function save() {
  if (state.mode === "voyage")
    try {
      localStorage.setItem(
        "overboard-save-v1",
        JSON.stringify({ wood: state.wood, levels: state.levels }),
      );
    } catch {}
}
function action() {
  if (state.firstAction === null)
    state.firstAction = (performance.now() - sessionStart) / 1000;
  startSurf();
}
function toast(t) {
  $("toast").textContent = t;
  $("toast").style.opacity = 1;
  toastTimer = 3;
}
function number(t) {
  let e = document.createElement("div");
  e.className = "float";
  e.textContent = t;
  e.style.left = 46 + rand() * 8 + "%";
  $("numbers").append(e);
  setTimeout(() => e.remove(), 1200);
}
function cost(k) {
  return Math.floor((k === "hull" ? 8 : 12) * Math.pow(1.75, state.levels[k]));
}
function requirement(k) {
  let l = state.levels[k];
  if ((k === "sail" || k === "work") && l > state.levels.hull)
    return "Hull " + l;
  if (k === "depth" && state.levels.hold < l) return "Hold " + l;
  return "";
}
function buy(k) {
  if (state.levels[k] >= 5 || state.wood < cost(k) || requirement(k))
    return false;
  action();
  state.wood -= cost(k);
  state.levels[k]++;
  state.upgrades++;
  buildRaft();
  burst(raftPos.x, wave(raftPos.x, raftPos.y, time) + 1, raftPos.y, 65, 2);
  sound(600, 0.3, "triangle", 0.15);
  setTimeout(() => sound(900, 0.35, "sine", 0.12), 90);
  shake = 0.25;
  toast(disciplines.find((d) => d.key === k).desc[state.levels[k] - 1]);
  number("TIER " + state.levels[k]);
  renderUpgrades();
  save();
  return true;
}
function renderUpgrades() {
  $("upgrades").innerHTML = disciplines
    .map((d) => {
      let l = state.levels[d.key],
        req = requirement(d.key);
      return `<div class="upgrade"><span class="icon">${d.icon}</span><div><strong>${d.name}</strong><small>${l === 5 ? "Mastercrafted" : d.desc[l]}</small><div class="tiers">${"▰".repeat(l)}${"▱".repeat(5 - l)}</div></div><button data-upgrade="${d.key}" ${l === 5 || state.wood < cost(d.key) || req ? "disabled" : ""}>${l === 5 ? "MAX" : req || cost(d.key) + " ▰"}</button></div>`;
    })
    .join("");
  document
    .querySelectorAll("[data-upgrade]")
    .forEach((b) => (b.onclick = () => buy(b.dataset.upgrade)));
}
function toggleBuild() {
  $("build").classList.toggle("hidden");
  renderUpgrades();
}
function initWorld() {
  for (let w of wrecks) {
    scene.remove(w.g);
    clearGroup(w.g);
    scene.remove(w.deep);
    clearGroup(w.deep);
  }
  wrecks.length = 0;
  items.length = 0;
  addItem(0, -2.6, 8);
  addItem(-2, -7, 5);
  addItem(3, -15, 6);
  for (let i = 0; i < 150; i++) {
    let a = rand() * TAU,
      r = 12 + Math.pow(rand(), 1.6) * 820;
    addItem(Math.sin(a) * r, Math.cos(a) * r, 3 + Math.floor(rand() * 6));
  }
  for (let i = 0; i < 18; i++) {
    let a = rand() * TAU,
      r = 35 + rand() * 750;
    createWreck(Math.sin(a) * r, Math.cos(a) * r, 0.7 + rand() * 0.7);
  }
  createWreck(-12, -39, 0.65);
  createWreck(15, -75, 1.1);
  rescueShip.position.set(
    state.mode === "rescue" ? (rand() - 0.5) * 160 : 160,
    0,
    state.mode === "rescue" ? -300 : -460,
  );
  buildRaft();
}
function switchMode(mode) {
  save();
  if (mode === "voyage") {
    try {
      saved = JSON.parse(localStorage.getItem("overboard-save-v1"));
    } catch {}
    state.levels = { ...emptyLevels(), ...saved?.levels };
    state.wood = saved?.wood || 0;
  } else {
    state.levels = emptyLevels();
    state.wood = 0;
  }
  Object.assign(state, {
    mode,
    x: 0,
    z: 0,
    stamina: 100,
    exposure: 0,
    aboard: false,
    active: true,
    elapsed: 0,
    total: 0,
    grabs: 0,
    breaks: 0,
    firstAction: null,
    upgrades: 0,
    weather: mode === "rescue" ? 0.8 + rand() * 0.55 : 1,
  });
  sessionStart = performance.now();
  raftPos.set(0, -13);
  raftAngle = 0;
  heading = 0;
  yaw = 0;
  initWorld();
  $("finish").classList.add("hidden");
  $("build").classList.add("hidden");
  $("voyage").classList.toggle("active", mode === "voyage");
  $("rescue").classList.toggle("active", mode === "rescue");
  toast(mode === "rescue" ? "Reach the passing ship" : "Ride the next crest");
}
function endRun(won) {
  state.active = false;
  $("finish").classList.remove("hidden");
  $("resultLabel").textContent = won ? "RESCUED" : "LOST AT SEA";
  $("resultTitle").textContent = won
    ? "Another sunrise."
    : "The sea keeps moving.";
  $("resultStats").textContent =
    `${state.grabs} recovered · ${state.breaks} wrecks · ${Math.floor(state.elapsed)} seconds`;
  sound(won ? 700 : 140, 0.7, "triangle", 0.16);
}
function grab() {
  if (!state.active) return;
  action();
  if (keys.q && state.levels.depth) {
    let w = wrecks.find(
      (w) => !w.dived && Math.hypot(w.x - state.x, w.z - state.z) < 10,
    );
    if (w) {
      w.dived = true;
      w.treasure.visible = false;
      let v = 25 * state.levels.depth;
      state.wood += v;
      state.grabs++;
      state.total += v;
      number("+" + v);
      toast("Deep hold recovered");
      sound(260, 0.4, "triangle", 0.2);
      burst(state.x, wave(state.x, state.z, time) - 3, state.z, 35);
      save();
      return;
    }
  }
  let reach = 3.5 + state.levels.hold * 1.3 + state.levels.depth * 1.2,
    found = items.filter(
      (i) => i.active && Math.hypot(i.x - state.x, i.z - state.z) < reach,
    );
  if (found.length) {
    let v = 0;
    for (let i of found) {
      i.active = false;
      v += Math.round(i.value * (1 + state.levels.work * 0.35));
      burst(i.x, wave(i.x, i.z, time) + 0.5, i.z, 17);
    }
    state.wood += v;
    state.total += v;
    state.grabs += found.length;
    number("+" + v);
    sound(470, 0.14, "triangle", 0.12);
    setTimeout(() => sound(720, 0.17, "sine", 0.09), 60);
    shake = 0.12;
    renderUpgrades();
    if (state.grabs === 1) toast("B · Lash a wider deck");
    save();
    return;
  }
  if (
    Math.hypot(state.x - raftPos.x, state.z - raftPos.y) <
    4 + state.levels.hull * 0.6
  ) {
    state.aboard = !state.aboard;
    if (state.aboard) {
      state.x = raftPos.x;
      state.z = raftPos.y;
      toast("A moment to breathe");
    } else {
      state.x += 4 + state.levels.hull * 0.5;
      toast("Back into the swell");
    }
    sound(170, 0.2, "sine", 0.1);
    return;
  }
  if (
    state.mode === "rescue" &&
    Math.hypot(
      state.x - rescueShip.position.x,
      state.z - rescueShip.position.z,
    ) < 20
  )
    endRun(true);
}
function ram() {
  if (!state.active || ramCooldown > 0) return;
  action();
  ramCooldown = 0.7;
  let hit = false;
  for (let w of wrecks)
    if (
      w.alive &&
      Math.hypot(w.x - state.x, w.z - state.z) < (state.aboard ? 12 : 7)
    ) {
      w.hp -= 1 + state.levels.work;
      hit = true;
      burst(w.x, wave(w.x, w.z, time) + 1, w.z, 40, 2);
      shake = 0.5;
      hitPause = 0.055;
      sound(100, 0.22, "sawtooth", 0.16);
      number("−" + (1 + state.levels.work));
      w.g.rotation.z += 0.12;
      if (w.hp <= 0) {
        w.alive = false;
        w.g.visible = false;
        state.breaks++;
        for (let j = 0; j < 12; j++)
          addItem(
            w.x + (rand() - 0.5) * 12,
            w.z + (rand() - 0.5) * 12,
            4 + state.levels.depth,
          );
        number("WRECK BROKEN");
        sound(70, 0.45, "triangle", 0.25);
      }
    }
  if (!hit) {
    if (state.wood >= cost("hull") && state.levels.hull < 5) {
      buy("hull");
      if (Math.hypot(state.x - raftPos.x, state.z - raftPos.y) > 12) {
        raftPos.set(state.x, state.z);
        state.aboard = true;
      }
      toast("Deck expanded");
    } else {
      state.stamina = Math.max(0, state.stamina - 8);
      burst(state.x, wave(state.x, state.z, time), state.z, 25);
      shake = 0.15;
      sound(180, 0.15, "sine", 0.07);
    }
  }
}
const keys = {};
addEventListener("keydown", (e) => {
  if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
    e.preventDefault();
  if (e.repeat) return;
  keys[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === "e") grab();
  if (e.key === " ") ram();
  if (e.key.toLowerCase() === "b") toggleBuild();
  if (e.key === "Escape") {
    $("build").classList.add("hidden");
    $("quality").classList.add("hidden");
  }
});
addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));
addEventListener("blur", () => {
  for (let k in keys) keys[k] = false;
});
let dragging = false,
  px = 0;
renderer.domElement.addEventListener("pointerdown", (e) => {
  dragging = true;
  px = e.clientX;
  action();
});
addEventListener("pointerup", () => (dragging = false));
addEventListener("pointermove", (e) => {
  if (dragging) {
    yaw -= (e.clientX - px) * 0.005;
    px = e.clientX;
  }
});
renderer.domElement.addEventListener("contextmenu", (e) => e.preventDefault());
$("salvage").onclick = toggleBuild;
$("closeBuild").onclick = toggleBuild;
$("voyage").onclick = () => switchMode("voyage");
$("rescue").onclick = () => switchMode("rescue");
$("again").onclick = () => switchMode(state.mode);
$("settings").onclick = () => $("quality").classList.toggle("hidden");
$("mute").onclick = () => {
  muted = !muted;
  $("mute").textContent = "Sound: " + (muted ? "off" : "on");
  if (surfAudio) surfAudio.gain.value = muted ? 0 : 0.22;
  else startSurf();
};
document.querySelectorAll("[data-key]").forEach((b) => {
  b.onpointerdown = (e) => {
    e.preventDefault();
    keys[b.dataset.key] = true;
    if (b.dataset.key === "e") grab();
    if (b.dataset.key === " ") ram();
  };
  b.onpointerup = b.onpointerleave = () => (keys[b.dataset.key] = false);
});
function setQuality(q) {
  autoQuality = q === "auto";
  quality = autoQuality
    ? navigator.hardwareConcurrency <= 4 || devicePixelRatio > 2
      ? "low"
      : "medium"
    : q;
  oceanMat.defines = quality === "low" ? { LOW_SEA: 1 } : {};
  oceanMat.needsUpdate = true;
  renderer.setPixelRatio(
    Math.min(
      devicePixelRatio,
      quality === "high" ? 1.7 : quality === "medium" ? 1.2 : 0.75,
    ),
  );
  seaGeometry(quality === "high" ? 280 : quality === "medium" ? 210 : 145);
  $("qualityLabel").textContent =
    (autoQuality ? "AUTO · " : "") + quality.toUpperCase();
}
document
  .querySelectorAll("[data-quality]")
  .forEach((b) => (b.onclick = () => setQuality(b.dataset.quality)));
setQuality("auto");
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
initWorld();
toast("E · Catch the driftwood");
let last = performance.now(),
  frameCount = 0,
  fps = 60,
  fpsClock = 0,
  fpsFrames = 0;
const fpsSamples = [];
function update(dt) {
  time += dt;
  weather = T.MathUtils.lerp(
    weather,
    state.mode === "rescue"
      ? state.weather
      : Math.hypot(state.x + 380, state.z + 650) < 175
        ? 1.65
        : 1,
    Math.min(1, dt * 0.3),
  );
  uniforms.uWeather.value = weather;
  mist.position.set(state.x, 0, state.z);
  uniforms.uTime.value = time;
  uniforms.uCenter.value.set(state.x, state.z);
  if (state.active) {
    state.elapsed += dt;
    ramCooldown = Math.max(0, ramCooldown - dt);
    let ix =
        (keys.d || keys.arrowright ? 1 : 0) -
        (keys.a || keys.arrowleft ? 1 : 0),
      iz =
        (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0);
    const pad = navigator.getGamepads?.()[0];
    if (pad) {
      ix += Math.abs(pad.axes[0]) > 0.15 ? pad.axes[0] : 0;
      iz += Math.abs(pad.axes[1]) > 0.15 ? pad.axes[1] : 0;
      if (pad.buttons[0]?.pressed && !keys.padE) {
        grab();
        keys.padE = true;
      } else if (!pad.buttons[0]?.pressed) keys.padE = false;
      if (pad.buttons[2]?.pressed && !keys.padRam) {
        ram();
        keys.padRam = true;
      } else if (!pad.buttons[2]?.pressed) keys.padRam = false;
      yaw -= pad.axes[2] * dt * 1.5;
    }
    let move = Math.hypot(ix, iz) > 0;
    if (move) {
      action();
      let l = Math.max(1, Math.hypot(ix, iz));
      ix /= l;
      iz /= l;
      const dx = ix * Math.cos(yaw) + iz * Math.sin(yaw),
        dz = iz * Math.cos(yaw) - ix * Math.sin(yaw);
      heading = Math.atan2(-dx, -dz);
      let surge = keys.shift && state.stamina > 5,
        speed = state.aboard
          ? 4.4 + state.levels.sail * 2.5 + state.levels.work * 0.3
          : 3.8 + state.levels.fins * 1.2 + state.levels.depth * 0.25;
      if (keys.q && state.levels.depth >= 4) speed *= 2;
      speed *= surge ? 1.85 : 1;
      state.stamina = Math.max(
        0,
        state.stamina - dt * (surge ? 13 : state.aboard ? -12 : 1.8),
      );
      state.stamina = Math.min(100, state.stamina);
      if (state.stamina < 2) speed *= 0.55;
      state.x += dx * speed * dt;
      state.z += dz * speed * dt;
      if (state.aboard) {
        raftPos.set(state.x, state.z);
        raftAngle = T.MathUtils.lerp(raftAngle, heading, 0.035);
      }
      strokeTimer += dt;
      if (strokeTimer > (surge ? 0.16 : 0.4)) {
        strokeTimer = 0;
        burst(
          state.x,
          wave(state.x, state.z, time),
          state.z,
          5,
          surge ? 0.8 : 0.3,
        );
        if (!state.aboard) sound(90 + Math.random() * 80, 0.09, "sine", 0.015);
      }
    } else
      state.stamina = Math.min(
        100,
        state.stamina + dt * (state.aboard ? 22 : 7),
      );
    for (let ob of scene.children)
      if (ob.userData.reef) {
        let dx = state.x - ob.position.x,
          dz = state.z - ob.position.z,
          r = Math.min(ob.scale.x, ob.scale.z) * 0.65,
          d = Math.hypot(dx, dz);
        if (d < r) {
          let scale = (r - d) / Math.max(d, 0.01);
          state.x += dx * scale;
          state.z += dz * scale;
          if (state.aboard) {
            raftPos.set(state.x, state.z);
            if (ramCooldown <= 0) {
              ramCooldown = 1;
              shake = 0.45;
              burst(state.x, wave(state.x, state.z, time), state.z, 25);
              sound(85, 0.2, "triangle", 0.2);
              let lost = Math.min(state.wood, 3);
              state.wood -= lost;
              for (let j = 0; j < lost; j++)
                addItem(state.x + 5 + j, state.z, 1);
            }
          }
        }
      }
    let storm = Math.hypot(state.x + 380, state.z + 650) < 175;
    state.exposure = Math.max(
      0,
      Math.min(
        100,
        state.exposure +
          dt *
            (state.aboard
              ? -(2 + state.levels.hold)
              : (0.58 + (storm ? 0.65 : 0)) /
                (1 + state.levels.hold * 0.4 + state.levels.depth * 0.25)),
      ),
    );
    if (
      storm &&
      state.aboard &&
      state.levels.hull < 2 &&
      Math.sin(time * 1.5) > 0.997 &&
      state.wood > 0
    ) {
      state.wood = Math.max(0, state.wood - 1);
      addItem(state.x + 6, state.z + 2, 1);
      shake = 0.2;
      toast("Loose cargo overboard");
    }
    if (state.exposure >= 100) {
      if (state.mode === "rescue") endRun(false);
      else {
        state.wood = Math.floor(state.wood * 0.8);
        state.aboard = true;
        state.x = raftPos.x;
        state.z = raftPos.y;
        state.exposure = 25;
        toast("Washed onto your raft");
        save();
      }
    }
    if (state.mode === "rescue") {
      rescueShip.position.x += dt * 0.25;
      if (state.elapsed >= 150) endRun(false);
      if (
        Math.hypot(
          state.x - rescueShip.position.x,
          state.z - rescueShip.position.z,
        ) < 16
      )
        endRun(true);
    }
    workTimer += dt;
    spawnTimer += dt;
    if (workTimer > 12 && state.levels.work && state.aboard) {
      workTimer = 0;
      let gain = state.levels.work * 2;
      state.wood += gain;
      number("+" + gain);
      sound(450, 0.12, "triangle", 0.04);
    }
    if (spawnTimer > 16) {
      spawnTimer = 0;
      let a = rand() * TAU;
      for (let i = 0; i < 4; i++)
        addItem(
          state.x + Math.sin(a + i * 0.2) * 45,
          state.z + Math.cos(a + i * 0.2) * 45,
          3 + Math.floor(rand() * 5),
        );
    }
    saveTimer += dt;
    if (saveTimer > 10) {
      saveTimer = 0;
      save();
    }
  }
  let diving = !!keys.q && state.levels.depth > 0 && !state.aboard;
  sky.visible = !diving;
  scene.background = diving ? new T.Color(0x372c1b) : null;
  for (let w of wrecks)
    w.deep.visible = diving && Math.hypot(w.x - state.x, w.z - state.z) < 85;
  diveBlend = T.MathUtils.lerp(diveBlend, diving ? 1 : 0, Math.min(1, dt * 3));
  let y =
    wave(state.x, state.z, time) * (1 - diveBlend) -
    diveBlend * (4 + state.levels.depth * 0.1);
  swimmer.position.set(state.x, y + (state.aboard ? 0.65 : -0.08), state.z);
  swimmer.rotation.set(
    state.aboard ? -0.65 : Math.sin(time * 1.4) * 0.09,
    heading,
    Math.sin(time * 1.9) * 0.06,
  );
  swimmer.visible = !(diving && state.levels.depth >= 4);
  sub.visible = diving && state.levels.depth >= 4;
  sub.position.copy(swimmer.position);
  sub.rotation.y = heading;
  ripple.visible = !diving;
  ripple.position.set(state.x, y + 0.08, state.z);
  ripple.scale.set(
    1 + Math.sin(time * 4) * 0.1,
    1 + Math.cos(time * 4) * 0.1,
    1,
  );
  for (let i = 0; i < 2; i++) {
    arms[i].rotation.x =
      Math.sin(time * 6 + i * Math.PI) * (state.aboard ? 0.1 : 0.9);
    arms[i].rotation.z = (i ? 1 : -1) * 0.3;
    legs[i].rotation.x = Math.sin(time * 7 + i * Math.PI) * 0.25;
    let fin = legs[i].getObjectByName("fin");
    if (state.levels.fins && !fin) {
      fin = box(legs[i], 0.24, 0.05, 0.4, mats.edge, 0, 0, 0.8);
      fin.name = "fin";
    }
    if (fin) {
      fin.visible = state.levels.fins > 0;
      fin.scale.setScalar(0.8 + state.levels.fins * 0.16);
    }
  }
  if (!state.aboard) {
    raftPos.x += Math.sin(time * 0.3) * dt * 0.08;
    raftPos.y += dt * 0.07;
  }
  raft.position.set(raftPos.x, wave(raftPos.x, raftPos.y, time), raftPos.y);
  raft.rotation.set(
    (wave(raftPos.x, raftPos.y + 1, time) -
      wave(raftPos.x, raftPos.y - 1, time)) *
      0.14,
    raftAngle,
    (wave(raftPos.x + 1, raftPos.y, time) -
      wave(raftPos.x - 1, raftPos.y, time)) *
      -0.14,
  );
  raft.updateMatrixWorld();
  for (let i = 0; i < Math.min(24, Math.ceil(state.wood / 8)); i++) {
    dummy.position.set(
      ((i % 4) - 1.5) * 0.4,
      0.44 + Math.floor(i / 12) * 0.27,
      ((Math.floor(i / 4) % 3) - 1) * 0.95,
    );
    dummy.rotation.set(0, (i % 3) * 0.14, 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    cargo.setMatrixAt(
      i,
      new T.Matrix4().multiplyMatrices(raft.matrixWorld, dummy.matrix),
    );
  }
  cargo.count = Math.min(24, Math.ceil(state.wood / 8));
  cargo.instanceMatrix.needsUpdate = true;
  raft.traverse((o) => {
    if (o.userData.fan)
      o.userData.fan.rotation.z = time * (1 + state.levels.work * 0.4);
  });
  rescueShip.position.y =
    wave(rescueShip.position.x, rescueShip.position.z, time) * 0.5;
  rescueShip.rotation.z = Math.sin(time * 0.7) * 0.025;
  nearest = null;
  let nearD = 100;
  for (let i = 0; i < items.length; i++) {
    let it = items[i];
    if (it.active) {
      let d = Math.hypot(it.x - state.x, it.z - state.z);
      if (d < nearD) {
        nearD = d;
        nearest = it;
      }
      dummy.position.set(it.x, wave(it.x, it.z, time) + 0.22, it.z);
      dummy.rotation.set(
        Math.sin(time + it.phase) * 0.17,
        it.phase,
        Math.cos(time * 0.9 + it.phase) * 0.2,
      );
      dummy.scale.setScalar(d < 7 ? 1.08 + Math.sin(time * 4) * 0.06 : 1);
    } else {
      dummy.position.set(0, -100, 0);
      dummy.scale.setScalar(0);
    }
    dummy.updateMatrix();
    itemMesh.setMatrixAt(i, dummy.matrix);
  }
  itemMesh.count = items.length;
  itemMesh.instanceMatrix.needsUpdate = true;
  for (let w of wrecks)
    if (w.alive) {
      w.g.visible = Math.hypot(w.x - state.x, w.z - state.z) < 650;
      w.g.position.y = wave(w.x, w.z, time) * 0.7;
      w.g.rotation.x = Math.sin(time * 0.7 + w.x) * 0.03;
      if (
        state.aboard &&
        state.levels.work >= 3 &&
        Math.hypot(w.x - state.x, w.z - state.z) < 7 &&
        ramCooldown <= 0
      )
        ram();
    }
  for (let i = 0; i < particleCount; i++) {
    let p = particles[i];
    if (p.life > 0) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy -= 7 * dt;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(Math.max(0, p.life));
    } else {
      dummy.position.set(0, -100, 0);
      dummy.scale.setScalar(0);
    }
    dummy.rotation.set(0, time, 0);
    dummy.updateMatrix();
    particleMesh.setMatrixAt(i, dummy.matrix);
  }
  particleMesh.instanceMatrix.needsUpdate = true;
  let dist = state.aboard ? 11 + state.levels.hull * 0.6 : 8.8,
    desired = new T.Vector3(
      state.x + Math.sin(yaw) * dist,
      y + (state.aboard ? 5.4 : 2.5),
      state.z + Math.cos(yaw) * dist,
    );
  if (!diving)
    desired.y = Math.max(desired.y, wave(desired.x, desired.z, time) + 1.1);
  else desired.y = y + 1;
  scene.fog.color.setHex(diving ? 0x51402a : 0xba8c4f);
  scene.fog.density = diving ? 0.025 : 0.0038;
  camera.position.lerp(desired, 1 - Math.exp(-dt * 3.2));
  shake = Math.max(0, shake - dt * 1.2);
  camera.position.x += (Math.random() - 0.5) * shake;
  camera.position.y += (Math.random() - 0.5) * shake * 0.6;
  camera.lookAt(state.x, y + 0.5, state.z - 3);
  $("spray").style.opacity = Math.min(
    0.7,
    Math.max(0, (y - camera.position.y + 4) * 0.13) + shake,
  );
  let nr = "The Amber Reach";
  for (let r of regions)
    if (Math.hypot(state.x - r.x, state.z - r.z) < r.r) nr = r.name;
  if (nr !== region) {
    region = nr;
    toast(region);
  }
  $("area").textContent = region;
  $("coordinates").textContent =
    `${Math.abs(state.z * 0.01 + 34).toFixed(2)}° N   ${Math.abs(state.x * 0.01 + 8).toFixed(2)}° W`;
  $("wood").textContent = state.wood;
  $("stamina").style.width = state.stamina + "%";
  $("staminaText").textContent = Math.round(state.stamina);
  $("exposure").style.width = state.exposure + "%";
  $("exposureText").textContent = Math.round(state.exposure) + "%";
  $("modeLabel").textContent =
    state.mode === "rescue"
      ? `RESCUE RUN / ${Math.max(0, 150 - Math.floor(state.elapsed))}s`
      : "OPEN WATER / DAY " +
        String(1 + Math.floor(state.elapsed / 300)).padStart(2, "0");
  $("objective").textContent =
    state.mode === "rescue"
      ? `Rescue vessel · ${Math.round(Math.hypot(state.x - rescueShip.position.x, state.z - rescueShip.position.z))}m`
      : state.aboard
        ? "Your island. Anywhere."
        : "A foothold in the endless.";
  let prompt = "";
  if (nearD < 3.5 + state.levels.hold * 1.3 + state.levels.depth * 1.2)
    prompt =
      "<kbd>E</kbd> Recover +" +
      Math.round(nearest.value * (1 + state.levels.work * 0.35));
  else if (
    Math.hypot(state.x - raftPos.x, state.z - raftPos.y) <
    4 + state.levels.hull * 0.6
  )
    prompt = state.aboard
      ? "<kbd>E</kbd> Overboard"
      : "<kbd>E</kbd> Climb aboard";
  else if (
    wrecks.find((w) => w.alive && Math.hypot(w.x - state.x, w.z - state.z) < 12)
  )
    prompt = "<kbd>SPACE</kbd> Break wreck";
  if (
    state.mode === "rescue" &&
    Math.hypot(
      state.x - rescueShip.position.x,
      state.z - rescueShip.position.z,
    ) < 25
  )
    prompt = "<kbd>E</kbd> Rescue";
  if (
    diving &&
    wrecks.find(
      (w) => !w.dived && Math.hypot(w.x - state.x, w.z - state.z) < 10,
    )
  )
    prompt = "<kbd>E</kbd> Deep hold";
  $("interaction").innerHTML = prompt;
  let target =
    state.mode === "rescue"
      ? rescueShip.position
      : new T.Vector3(raftPos.x, raft.position.y + 2, raftPos.y);
  let projected = target.clone().project(camera);
  let targetDist = Math.hypot(state.x - target.x, state.z - target.z);
  beacon.style.display = targetDist > 8 && projected.z < 1 ? "block" : "none";
  beacon.style.left =
    Math.max(
      60,
      Math.min(innerWidth - 60, (projected.x * 0.5 + 0.5) * innerWidth),
    ) + "px";
  beacon.style.top =
    Math.max(
      110,
      Math.min(innerHeight - 170, (-projected.y * 0.5 + 0.5) * innerHeight),
    ) + "px";
  beacon.innerHTML =
    (state.mode === "rescue" ? "⚑" : "▱") +
    "<small>" +
    Math.round(targetDist) +
    "m</small>";
  toastTimer -= dt;
  if (toastTimer <= 0) $("toast").style.opacity = 0;
}
camera.position.set(0, 4, 9);
camera.lookAt(0, 0, -3);
function animate(now) {
  requestAnimationFrame(animate);
  let rawDt = (now - last) / 1000,
    dt = Math.min(0.25, rawDt);
  last = now;
  if (hitPause > 0) {
    hitPause -= dt;
    dt *= 0.12;
  }
  update(dt);
  renderer.render(scene, camera);
  frameCount++;
  fpsClock += rawDt;
  fpsFrames++;
  if (fpsClock > 1) {
    fps = fpsFrames / fpsClock;
    fpsSamples.push(fps);
    if (fpsSamples.length > 240) fpsSamples.shift();
    $("fps").textContent = fps.toFixed(0) + " FPS · " + quality;
    fpsClock = 0;
    fpsFrames = 0;
    if (
      autoQuality &&
      performance.now() - sessionStart > 2500 &&
      fps < 38 &&
      quality !== "low"
    ) {
      setQuality("low");
      autoQuality = true;
    }
  }
}
requestAnimationFrame(animate);
// DEV_START
if (new URLSearchParams(location.search).has("test")) {
  $("fps").classList.remove("hidden");
  window.__overboard = {
    state,
    reseed(n) {
      seed = n;
      initWorld();
    },
    items,
    wrecks,
    buy,
    grab,
    ram,
    switchMode,
    setQuality,
    teleport(x, z) {
      state.x = x;
      state.z = z;
      if (state.aboard) raftPos.set(x, z);
    },
    give(n) {
      state.wood += n;
      renderUpgrades();
    },
    board() {
      state.aboard = true;
      state.x = raftPos.x;
      state.z = raftPos.y;
    },
    stats() {
      return {
        fps,
        meanFps:
          fpsSamples.reduce((a, b) => a + b, 0) /
          Math.max(1, fpsSamples.length),
        firstAction: state.firstAction,
        frames: frameCount,
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        quality,
        wood: state.wood,
        grabs: state.grabs,
        breaks: state.breaks,
        levels: { ...state.levels },
        elapsed: state.elapsed,
      };
    },
    raft: raftPos,
    rescueShip,
  };
}
// DEV_END
