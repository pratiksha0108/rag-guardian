import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadDataset } from '../src/datasets.js';
import { chunkDocuments, retrieveChunks, answerQuestion, evaluateDataset } from '../src/retrieval.js';
import { createServer } from '../src/server.js';

test('snapshot integrity and source attribution are available offline',()=>{
  const d=loadDataset('salesforce-lwc');
  assert.equal(d.documents.length,8);
  assert.equal(d.provenance.license,'CC0-1.0');
  assert.equal(d.provenance.revision,'7524748ece585fc08413b3fcfb2e5494e24f29ed');
  for(const doc of d.documents) for(const file of doc.sourceFiles) assert.ok(file.url.includes(d.provenance.revision));
});
test('development cases are drafts, reserved cases do not run by default',()=>{
  const d=loadDataset('salesforce-lwc');
  assert.equal(d.cases.length,10);assert.equal(d.reservedCount,4);
  assert.ok(d.cases.every(c=>c.split==='dev'&&c.reviewStatus==='draft'&&c.reviewer===null));
  assert.ok(evaluateDataset('salesforce-lwc').rows.every(r=>r.split==='dev'));
});
test('reserved source groups do not overlap development expected sources',()=>{
  for(const id of ['salesforce-lwc','salesforce-support']) {
    const b=JSON.parse(readFileSync(new URL(`../datasets/${id}/benchmark.json`,import.meta.url)));
    const dev=new Set(b.cases.filter(c=>c.split==='dev').map(c=>c.expectedSource).filter(Boolean));
    assert.ok(b.cases.filter(c=>c.split==='reserved').every(c=>!dev.has(c.expectedSource)));
  }
});
test('assistant corpora and source IDs are disjoint',()=>{
  const a=loadDataset('salesforce-lwc'),b=loadDataset('salesforce-support');
  assert.ok(a.documents.every(d=>d.id.startsWith('salesforce-lwc:')));
  assert.ok(b.documents.every(d=>d.id.startsWith('salesforce-support:')));
  const result=answerQuestion('salesforce-support','Which account creation API does ldsCreateRecord use?','agent');
  assert.ok(result.sourceIds.every(id=>id.startsWith('salesforce-support:')));
});
test('role and archived filters operate before scoring',()=>{
  const d=loadDataset('salesforce-support');
  const agent=retrieveChunks('Salesforce bulk export escalation code','agent',d);
  assert.ok(agent.every(c=>c.roles.includes('agent')&&c.status==='current'));
  const admin=retrieveChunks('Salesforce bulk export escalation code','admin',d);
  assert.equal(admin[0].sourceId,'salesforce-support:export');
  assert.ok(!agent.some(c=>c.sourceId==='salesforce-support:export'));
});
test('chunks preserve exact text and original line locations',()=>{
  const d=loadDataset('salesforce-lwc');
  for(const c of chunkDocuments(d.documents)) {
    const file=d.documents.find(d=>d.id===c.sourceId).sourceFiles.find(f=>f.path===c.path);
    assert.equal(c.text,file.text.split('\n').slice(c.startLine-1,c.endLine).join('\n'));
    assert.ok(c.endLine-c.startLine<35);
  }
});
test('dataset fingerprint is stable and distinct by assistant',()=>{
  assert.equal(loadDataset('salesforce-lwc').datasetHash,loadDataset('salesforce-lwc').datasetHash);
  assert.notEqual(loadDataset('salesforce-lwc').datasetHash,loadDataset('salesforce-support').datasetHash);
});
test('unreviewed drafts cannot yield a release PASS',()=>{
  for(const id of ['salesforce-lwc','salesforce-support']) {
    const r=evaluateDataset(id);assert.notEqual(r.summary.verdict,'PASS');assert.equal(r.summary.reviewedCases,0);assert.ok(r.summary.readiness.includes('pending'));
  }
});
test('invalid assistant, roles and empty/oversized questions rejected',()=>{
  assert.throws(()=>loadDataset('../elsewhere'),/Unknown assistant/);
  assert.throws(()=>loadDataset('salesforce-lwc','unknown'),/Unknown split/);
  for(const q of ['',null,'a'.repeat(2001)]) assert.throws(()=>answerQuestion('salesforce-lwc',q,'developer'),/question/);
  assert.throws(()=>answerQuestion('salesforce-lwc','create a record','admin'),/Role/);
});
test('entirely unrelated question returns no matching evidence',()=>{
  assert.equal(answerQuestion('salesforce-lwc','coffee machine warranty period','developer').abstained,true);
});
test('query route validates scope and keeps reserved split out of web workflow',async()=>{
  const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(base+'/datasets')).status,200);
    const home=await (await fetch(base+'/')).text();
    assert.match(home,/visitor.js/);
    assert.equal(await (await fetch(base+'/datasets')).text(),home);
    assert.match(await (await fetch(base+'/advanced')).text(),/app.js/);
    assert.match(await (await fetch(base+'/dataset-lab')).text(),/datasets.js/);
    for(const asset of ['/visitor.js','/simple.css'])assert.equal((await fetch(base+asset)).status,200);
    assert.equal((await (await fetch(base+'/api/datasets')).json()).length,2);
    assert.equal((await fetch(base+'/api/datasets/salesforce-lwc/evaluate?split=reserved')).status,400);
    assert.equal((await fetch(base+'/api/datasets/salesforce-lwc?split=reserved')).status,400);
    assert.equal((await fetch(base+'/api/datasets/unknown')).status,400);
    const r=await fetch(base+'/api/datasets/salesforce-support/query',{method:'POST',body:JSON.stringify({question:'Salesforce bulk export escalation code',role:'admin'})});
    assert.equal(r.status,200);assert.equal((await r.json()).sourceIds[0],'salesforce-support:export');
    assert.equal((await fetch(base+'/api/datasets/salesforce-lwc/query',{method:'POST',body:'bad json'})).status,400);
    assert.equal((await fetch(base+'/api/datasets/salesforce-lwc/query',{method:'POST',headers:{origin:'https://elsewhere.invalid'},body:'{}'})).status,403);
    assert.equal((await fetch(base+'/api/datasets/salesforce-lwc/query',{method:'POST',body:'x'.repeat(11000)})).status,413);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});
