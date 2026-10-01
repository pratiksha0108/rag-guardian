import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),out=new URL('dist/',root);
await mkdir(new URL('assets/',out),{recursive:true});
const relative=s=>s.replaceAll('"/assets/','"./assets/').replaceAll("'/assets/","'./assets/").replaceAll('"/lavender.css"','"./lavender.css"').replaceAll('"/policy.js"','"./policy.js"').replaceAll('"/business.js"','"./business.js"').replaceAll("'/policy-engine.js'","'./policy-engine.js'").replaceAll('href="/"','href="./"').replaceAll('href="/behavior-lab"','href="./behavior-lab.html"');
for(const [src,dst] of [['public/simple.html','index.html'],['public/behavior.html','behavior-lab.html'],['public/lavender.css','lavender.css'],['public/policy.js','policy.js'],['src/policy-checks.js','policy-engine.js'],['src/business.js','business-engine.js']]){
 let text=relative(await readFile(new URL(src,root),'utf8'));
 if(dst.endsWith('.html'))text=text.replace(/<footer>[\s\S]*?<\/footer>/,'<footer><span>A scripted portfolio prototype. No account or payment needed.</span><div><a href="https://pratiksha0108.github.io/portfolio/projects/">← All projects</a><a href="https://github.com/pratiksha0108/rag-guardian">Source & documentation</a></div></footer>');
 await writeFile(new URL(dst,out),text);
}
let business=await readFile(new URL('public/business.js',root),'utf8');
const start=business.indexOf('async function api('),end=business.indexOf('\nfunction lock',start);
if(start<0||end<0)throw Error('Business adapter boundary not found.');
business=business.slice(0,start)+`async function api(path,value){if(path==='/api/business')return samplePolicy;if(path==='/api/business/reply')return simulateReply(value.question,value.mode);if(path==='/api/business/check')return checkBehavior(value);throw Error('Unsupported demo action.');}`+business.slice(end);
await writeFile(new URL('business.js',out),"import {policy as samplePolicy,simulateReply,checkBehavior} from './business-engine.js';\n"+relative(business));
for(const name of ['guardian-parts.png','guardian-sprite.png','cafe-stage.png','shield-check.svg','tabler-LICENSE'])await copyFile(new URL('public/assets/'+name,root),new URL('assets/'+name,out));
await writeFile(new URL('.nojekyll',out),'');
console.log('Static Pages build ready in dist. Only fictional demo data and public assets are included.');
