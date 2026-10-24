import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
for(const file of ['index.html','style.css','game.js']) {let s=fs.readFileSync(file,'utf8');if(file==='game.js') s=s.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,''); fs.writeFileSync('dist/'+file,s);}
