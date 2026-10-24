import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
for(const f of ['index.html','style.css','game.js']){let s=fs.readFileSync('src/'+f,'utf8');if(f==='game.js')s=s.replace(/\/\/ DEV_START[\s\S]*?\/\/ DEV_END/g,'');fs.writeFileSync('dist/'+f,s)}
