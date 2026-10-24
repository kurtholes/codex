import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
await mkdir('dist/vendor',{recursive:true});
await copyFile('index.html','dist/index.html');
await writeFile('dist/style.css',(await readFile('style.css','utf8')).replace(/#devFps\{[^}]*\}/g,''));
let source=await readFile('game.js','utf8');
source=source.replace('/* DEV_BRIDGE */','').replace(',autoDrive=false','').replace(/^if\(autoDrive\).*\n/m,'');
await writeFile('dist/game.js',source);
for(const file of ['three.module.js','LICENSE'])await copyFile(`vendor/${file}`,`dist/vendor/${file}`);
console.log('Static build: dist/ (development bridge and driver excluded)');
