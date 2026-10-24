import {mkdir,copyFile,readFile,writeFile,rm} from 'node:fs/promises';
const dev=process.argv.includes('--dev'),out=dev?'.dev':'dist';
await rm(out,{recursive:true,force:true});await mkdir(out+'/vendor',{recursive:true});
for(const f of ['index.html','style.css'])await copyFile('src/'+f,out+'/'+f);
await copyFile('vendor/three.module.js',out+'/vendor/three.module.js');await copyFile('vendor/THREE-LICENSE.txt',out+'/vendor/THREE-LICENSE.txt');
let js=await readFile('src/game.js','utf8');
js=js.replace(/\/\* DEV_START \*\/[\s\S]*?\/\* DEV_END \*\//g,dev?m=>m:'');
await writeFile(out+'/game.js',js);console.log('Built '+out);
