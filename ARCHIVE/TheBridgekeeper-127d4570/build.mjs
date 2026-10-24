import{readFileSync,writeFileSync,mkdirSync}from'node:fs';
mkdirSync('dist',{recursive:true});let js=readFileSync('src/game.js','utf8');js=js.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');writeFileSync('dist/game.js',js);writeFileSync('dist/index.html',readFileSync('src/index.html','utf8'));console.log('Built static production game');
