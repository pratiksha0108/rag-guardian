import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const base = new URL('../datasets/', import.meta.url);
export const digest = value => createHash('sha256').update(value).digest('hex');
const json = path => JSON.parse(readFileSync(new URL(path, base), 'utf8'));
export const assistants = [
  {id:'salesforce-lwc',name:'Salesforce developer',description:'Pinned LWC Recipes examples · public source code · CC0-1.0',roles:['developer'],kind:'public-source',version:'draft-v1'},
  {id:'salesforce-support',name:'Salesforce support',description:'Fictional Northstar procedures · permission and version scenarios',roles:['agent','admin'],kind:'synthetic',version:'draft-v1'},
];

export function loadDataset(id, split = 'dev') {
  const assistant = assistants.find(a=>a.id === id);
  if (!assistant) throw new Error('Unknown assistant.');
  if (!['dev','reserved'].includes(split)) throw new Error('Unknown split.');
  const benchmark = json(`${id}/benchmark.json`);
  let documents, provenance;
  if (id === 'salesforce-lwc') {
    const manifest = json('salesforce-lwc/manifest.json');
    const files = manifest.files.map(f=>{
      if (!/^raw\/[a-zA-Z0-9_.-]+$/.test(f.file)) throw new Error('Invalid snapshot path.');
      const bytes = readFileSync(new URL(`salesforce-lwc/${f.file}`,base));
      if(digest(bytes)!==f.sha256) throw new Error(`Snapshot integrity check failed: ${f.path}`);
      return {...f,text:bytes.toString('utf8')};
    });
    const groups = new Map();
    for (const file of files.filter(f=>f.path !== 'LICENSE.md')) {
      const key = file.path === 'README.md' ? 'setup' : file.path.includes('/pubsub/') ? 'pubsub-note' : file.path.split('/').at(-2);
      if(!groups.has(key)) groups.set(key,[]);
      groups.get(key).push(file);
    }
    documents = [...groups].map(([key, sourceFiles])=>({
      id:`${id}:${key}`,assistantId:id,title:key === 'setup' ? 'LWC Recipes setup README' : key,
      status:'current',roles:['developer'],version:manifest.revision,sourceKind:'public-source',
      text:sourceFiles.map(f=>f.text).join('\n\n'),sourceFiles,license:manifest.license,
    }));
    provenance={repository:manifest.repository,revision:manifest.revision,license:manifest.license,retrievedAt:manifest.retrievedAt};
  } else {
    const corpus=json('salesforce-support/corpus.json');
    documents=corpus.documents;
    provenance={sourceKind:'synthetic',version:corpus.version,notice:'Authored fictional policies. Not Salesforce guidance or customer data.'};
  }
  const cases=benchmark.cases.filter(c=>c.split === split);
  if (!cases.length || new Set(benchmark.cases.map(c=>c.id)).size !== benchmark.cases.length) throw new Error('Invalid benchmark case IDs or empty split.');
  for(const c of benchmark.cases) {
    if(c.assistantId!==id || !assistant.roles.includes(c.role)) throw new Error('Benchmark assistant or role mismatch.');
    if(c.expectedSource!==null && !documents.some(d=>d.id === c.expectedSource && d.text.includes(c.expected))) throw new Error(`Missing expected evidence for ${c.id}.`);
  }
  const datasetHash=digest(JSON.stringify({assistantId:id,documents:documents.map(({sourceFiles,...d})=>d),benchmark}));
  return {assistant,documents,cases,provenance,datasetHash,benchmarkVersion:benchmark.version,split,reservedCount:benchmark.cases.filter(c=>c.split==='reserved').length};
}
