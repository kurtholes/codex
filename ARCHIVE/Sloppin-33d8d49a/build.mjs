import fs from 'node:fs';
process.chdir(new URL('.',import.meta.url).pathname);
fs.mkdirSync('dist',{recursive:true});
fs.copyFileSync('index.html','dist/index.html');
let s=fs.readFileSync('game.js','utf8');
s=s.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
fs.writeFileSync('dist/game.js',s);
