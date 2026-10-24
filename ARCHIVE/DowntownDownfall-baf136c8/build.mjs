import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
for(const file of ['index.html','style.css','game.js']){let s=readFileSync('src/'+file,'utf8');if(file==='game.js')s=s.replace(/\/\/ DEV_START[\s\S]*?\/\/ DEV_END/g,'');writeFileSync('dist/'+file,s);}
