import {mkdirSync,readFileSync,writeFileSync,copyFileSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
for(const f of ['index.html','style.css'])copyFileSync(f,'dist/'+f);
let js=readFileSync('game.js','utf8').replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
writeFileSync('dist/game.js',js);
