import { evaluateDataset } from './retrieval.js';
try {
  if(process.argv.length>3) throw new Error('Only development evaluations are supported here. Reserved evaluation needs a separate frozen experiment.');
  const r=evaluateDataset(process.argv[2]||'salesforce-lwc');
  console.log(JSON.stringify(r,null,2));
  process.exitCode=r.summary.verdict==='PASS'?0:1;
}catch(e){console.error(e.message);process.exitCode=2;}
