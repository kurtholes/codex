import fs from 'node:fs';
fs.mkdirSync('dist',{recursive:true});
for(const name of ['index.html','style.css','world.js'])fs.copyFileSync(name,'dist/'+name);
fs.writeFileSync('dist/game.js',fs.readFileSync('game.js','utf8').replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,''));
if(fs.readFileSync('dist/game.js','utf8').includes('__game'))throw new Error('Debug API leaked into build');
