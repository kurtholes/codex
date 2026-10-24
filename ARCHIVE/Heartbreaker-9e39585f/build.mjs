import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
let js=fs.readFileSync('src/game.js','utf8');
if(!process.argv.includes('--dev')) js=js.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
fs.writeFileSync('dist/game.js',js);fs.copyFileSync('src/index.html','dist/index.html');
