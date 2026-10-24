import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
for(const f of ['index.html','style.css'])fs.copyFileSync(f,'dist/'+f);
let js=fs.readFileSync('game.js','utf8');
js=js.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
fs.writeFileSync('dist/game.js',js);
console.log('Built dist; development hooks removed.');
