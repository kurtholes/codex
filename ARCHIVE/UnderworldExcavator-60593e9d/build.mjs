import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
await mkdir('dist', {recursive:true});
await copyFile('src/style.css','dist/style.css');
await writeFile('dist/index.html',(await readFile('src/index.html','utf8')).replace(/<script type="module">if\(new URLSearchParams[\s\S]*?<\/script>/,''));
const game=await readFile('src/game.js','utf8');
await writeFile('dist/game.js',game.slice(0,game.indexOf('// Development entry')));
console.log('Static build: dist/; development hooks stripped.');
