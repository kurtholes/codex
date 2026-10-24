import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await copyFile('index.html','dist/index.html');
await copyFile('style.css','dist/style.css');
let s=await readFile('game.js','utf8');
s=s.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
await writeFile('dist/game.js',s);
console.log('Static production build: dist/');
