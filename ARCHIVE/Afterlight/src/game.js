export const LENGTH = 7600;
export const RELAYS = [
  { s: 1450, name: 'The Bellkeeper', place: 'THE DROWNED BELFRY', color: '#6ff5ee', target: [2, 5, 3], initial: [6, 1, 7], story: 'Every morning I rang the bells before the sun rose. No one told me to. I liked to think the light was answering.', echo: 'The first voice is not a command. It is a habit of hope.' },
  { s: 3570, name: 'The Gardener', place: 'THE GLASS ORCHARD', color: '#ff72ba', target: [5, 2, 6], initial: [1, 6, 3], story: 'The trees were never meant to grow here. Salt in the soil, glass in the rain. I planted them anyway. Someone had to be first.', echo: 'The second voice planted something it would never see.' },
  { s: 5790, name: 'The Ferryman', place: 'THE LAST CROSSING', color: '#ffbc76', target: [3, 6, 1], initial: [7, 3, 5], story: 'I carried the last passengers away. Then I turned the boat around. A city is not empty while someone is coming home.', echo: 'The final voice chose to return. Now the city is listening.' }
];
export const MEMORIES = [
  {s:660,x:-30,title:'A window left open',text:'Someone used to leave a window open above the river. They said the current sounded like a person breathing.'},
  {s:2270,x:42,title:'A name in the rain',text:'We named the rain after people we missed. On the last day, the whole sky was full of names.'},
  {s:4420,x:-42,title:'An impossible orchard',text:'In a city made of glass, one woman grew a tree. By spring, every balcony had a garden.'},
  {s:6600,x:28,title:'The return journey',text:'The ferry ticket has two punches: one for leaving, one for coming home. There is still room for another.'}
];
export const clamp = (x,a,b)=>Math.max(a,Math.min(b,x));
export const riverX = s => Math.sin(s/590)*175 + Math.sin(s/260)*65;
export const riverWidth = s => 87 + 13*Math.sin(s/310) + 8*Math.cos(s/123);
export function createState() { return {s:30, lateral:0, speed:0, charge:1, relays:[false,false,false], memories:[], elapsed:0, ending:null, checkpoint:30, chapter:0}; }
export function nextRelay(st) { return st.relays.findIndex(v=>!v); }
export function objective(st) { const i=nextRelay(st); return i<0?{s:7330,name:'The Dawn Engine',place:'THE HEART OF THE CITY'}:{...RELAYS[i],index:i}; }
export function step(st,input,dt) {
  dt=clamp(dt,0,.06); if(st.ending) return;
  st.elapsed+=dt;
  const boost=input.boost && st.charge>.035 && !input.brake;
  const target=input.brake?0:(input.thrust||boost)?(boost?39:20):7.5;
  st.speed+=(target-st.speed)*Math.min(1,dt*1.45);
  st.charge=clamp(st.charge+(boost?-.13:.065)*dt,0,1);
  st.lateral+=input.steer*(12+st.speed*.45)*dt;
  const edge=riverWidth(st.s)-8;
  if(Math.abs(st.lateral)>edge){st.lateral=clamp(st.lateral,-edge,edge);st.speed*=1-dt*1.5;}
  const i=nextRelay(st), barrier=i<0?LENGTH-220:RELAYS[i].s+70;
  st.s=Math.min(barrier,st.s+st.speed*dt);
  if(st.s===barrier)st.speed=Math.min(st.speed,2);
}
export function tuneDistance(a,b) { const d=Math.abs(a-b); return Math.min(d,8-d); }
export function tuneSolved(values,target) { return values.every((v,i)=>v===target[i]); }
export function activate(st,index) {
  if(index!==nextRelay(st) || index<0 || index>2 || Math.abs(st.s-RELAYS[index].s)>110) return false;
  st.relays[index]=true;st.checkpoint=RELAYS[index].s+45;st.charge=1;return true;
}
export function recover(st) {st.s=st.checkpoint;st.lateral=0;st.speed=0;st.charge=1;}
export function finish(st,ending){if(st.relays.every(Boolean)&&st.s>=7230&&['awaken','release'].includes(ending)){st.ending=ending;return true;}return false;}
export function serialize(st){return JSON.stringify({version:1,...st});}
export function restore(raw) {
  try {
    const o=JSON.parse(raw);
    if(o.version!==1||!Array.isArray(o.relays)||o.relays.length!==3||!o.relays.every(x=>typeof x==='boolean')||(!o.relays[0]&&o.relays[1])||(!o.relays[1]&&o.relays[2]))return null;
    const st=createState(); st.relays=o.relays;
    const n=nextRelay(st),max=n<0?LENGTH-220:RELAYS[n].s+70;
    st.s=clamp(Number.isFinite(o.s)?o.s:30,0,max);st.lateral=clamp(Number.isFinite(o.lateral)?o.lateral:0,-60,60);
    st.memories=Array.isArray(o.memories)?[...new Set(o.memories.filter(x=>Number.isInteger(x)&&x>=0&&x<MEMORIES.length))]:[];
    st.elapsed=Number.isFinite(o.elapsed)?clamp(o.elapsed,0,1e7):0;
    const count=st.relays.filter(Boolean).length;st.checkpoint=count?RELAYS[count-1].s+45:30;
    st.ending=st.relays.every(Boolean)&&['awaken','release'].includes(o.ending)?o.ending:null;
    return st;
  }catch{return null;}
}
