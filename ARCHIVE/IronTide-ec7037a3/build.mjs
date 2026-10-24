import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const f of ['index.html','style.css'])await copyFile(f,'dist/'+f);
let js=await readFile('game.js','utf8');js=js.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');await writeFile('dist/game.js',js);
