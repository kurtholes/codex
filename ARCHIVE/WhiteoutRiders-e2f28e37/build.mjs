import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
process.chdir(new URL('.',import.meta.url).pathname);
await mkdir('dist',{recursive:true});for(const f of ['index.html','style.css'])await copyFile('src/'+f,'dist/'+f);const code=await readFile('src/game.js','utf8');await writeFile('dist/game.js',code.replace('/* DEV_HOOK */',''));console.log('Built dist — production debug hooks absent.');
