import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
fs.cpSync('src/vendor','dist/vendor',{recursive:true});
for(const f of ['index.html','style.css'])fs.copyFileSync('src/'+f,'dist/'+f);
let js=fs.readFileSync('src/game.js','utf8');
js=js.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,'');
fs.writeFileSync('dist/game.js',js);
console.log('Static production build: dist/');
