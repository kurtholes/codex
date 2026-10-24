import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
fs.copyFileSync('index.html','dist/index.html');
let js=fs.readFileSync('game.js','utf8').replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
fs.writeFileSync('dist/game.js',js);
