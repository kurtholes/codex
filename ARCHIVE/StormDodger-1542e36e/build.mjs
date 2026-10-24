import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
for(const f of ['index.html','style.css','game.js']) { let s=readFileSync('src/'+f,'utf8'); if(f==='game.js') s=s.replace(/\/\/ DEV_START[\s\S]*?\/\/ DEV_END/g,''); writeFileSync('dist/'+f,s); }
