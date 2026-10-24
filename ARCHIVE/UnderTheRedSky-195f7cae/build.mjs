import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/index.html',fs.readFileSync('index.html','utf8').replace('./src/game.js','./game.js'));
let js=fs.readFileSync('src/game.js','utf8');
js=js.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
fs.writeFileSync('dist/game.js',js);
