import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
for(const f of ['index.html','style.css'])copyFileSync('src/'+f,'dist/'+f);
mkdirSync('dist/vendor',{recursive:true});for(const f of ['GLTFLoader.js','BufferGeometryUtils.js','THREE-LICENSE.txt'])copyFileSync('src/vendor/'+f,'dist/vendor/'+f);
let s=readFileSync('src/game.js','utf8');s=s.replace(/\/\/ DEV_START[\s\S]*?\/\/ DEV_END/g,'');writeFileSync('dist/game.js',s);
