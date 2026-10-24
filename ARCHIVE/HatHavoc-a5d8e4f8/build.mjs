import {fileURLToPath} from 'node:url';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
process.chdir(fileURLToPath(new URL('.',import.meta.url)));
await mkdir('dist',{recursive:true});
await copyFile('src/index.html','dist/index.html');
await copyFile('src/style.css','dist/style.css');
let js=await readFile('src/game.js','utf8');
js=js.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
await writeFile('dist/game.js',js);
