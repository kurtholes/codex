import {mkdir,readFile,writeFile} from 'node:fs/promises';
for(const [dir,dev] of [['dist',false],['.dev',true]]){await mkdir(dir,{recursive:true});for(const file of ['index.html','style.css','game.js']){let s=await readFile('src/'+file,'utf8');if(file==='game.js')s=s.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,match=>dev?match:'');await writeFile(dir+'/'+file,s);}}
