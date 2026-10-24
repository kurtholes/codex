import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const f of ['index.html','style.css']) await copyFile('src/'+f,'dist/'+f);
const source=await readFile('src/game.js','utf8');await writeFile('dist/game.js',source.split('// Only the separate development entry')[0]);
