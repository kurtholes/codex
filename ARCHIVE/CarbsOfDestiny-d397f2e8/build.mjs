import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
for(const f of ['index.html','style.css'])writeFileSync('dist/'+f,readFileSync(f));
let source=readFileSync('game.js','utf8');
source=source.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
writeFileSync('dist/game.js',source);
