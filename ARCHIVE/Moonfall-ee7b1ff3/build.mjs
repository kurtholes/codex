import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
mkdirSync('dist/src',{recursive:true});for(const f of ['index.html','style.css'])copyFileSync(f,'dist/'+f);let source=readFileSync('src/game.js','utf8').replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');writeFileSync('dist/src/game.js',source);console.log('Built production; development hooks removed.');
