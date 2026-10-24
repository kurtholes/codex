import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
copyFileSync('src/index.html','dist/index.html');
copyFileSync('src/style.css','dist/style.css');
let js=readFileSync('src/game.js','utf8');
js=js.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
writeFileSync('dist/game.js',js);
console.log('Static production build; developer hooks removed.');
