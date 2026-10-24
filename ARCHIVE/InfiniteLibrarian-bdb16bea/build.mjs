import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('dist',{recursive:true});
writeFileSync('dist/index.html',readFileSync('src/index.html','utf8'));
writeFileSync('dist/game.js',readFileSync('src/game.js','utf8').replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,''));
