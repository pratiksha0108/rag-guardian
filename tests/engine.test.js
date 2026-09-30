import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { compare, evaluateTrace, importReport, retrieve, summarize, validateImport } from '../src/engine.js';
import { profiles } from '../src/data.js';
import { createServer } from '../src/server.js';

test('higher aggregate correctness does not bypass critical failures', () => {
  const r = compare();
  assert.ok(r.candidate.summary.quality > r.baseline.summary.quality);
  assert.equal(r.candidate.summary.verdict, 'BLOCK');
  assert.equal(r.candidate.summary.critical, 4);
  assert.equal(r.baseline.summary.verdict, 'REVIEW');
});
test('restoring retrieval guards passes the same fixture', () => {
  const r = compare('repaired');
  assert.equal(r.candidate.summary.passed,16);
  assert.equal(r.candidate.summary.verdict,'PASS');
});
test('role filtering denies restricted evidence to employees but permits managers', () => {
  assert.equal(retrieve('manager compensation planning budget','employee',profiles.repaired).length,0);
  assert.equal(retrieve('manager compensation planning budget','manager',profiles.repaired)[0].id,'compensation');
});
test('current-source filter excludes the obsolete policy', () => {
  assert.equal(retrieve('annual leave days','employee',profiles.repaired)[0].id,'leave-current');
  assert.equal(retrieve('annual leave days','employee',profiles.candidate)[0].id,'leave-archive');
});
test('unanswerable query abstains', () => assert.equal(retrieve('pet insurance','employee',profiles.repaired).length,0));
test('critical policy checks override even a zero quality floor', () => assert.equal(compare('candidate',0).candidate.summary.verdict,'BLOCK'));
test('quality threshold changes REVIEW to PASS without changing results', () => {
  assert.equal(compare('baseline',60).candidate.summary.verdict,'PASS');
  assert.equal(compare('baseline',80).candidate.summary.verdict,'REVIEW');
});
test('unknown profile and invalid thresholds fail explicitly', () => {
  assert.throws(()=>compare('invented'),/Unknown/);
  for(const q of [-1,101,NaN,1.5]) assert.throws(()=>compare('candidate',q),/threshold/);
});
test('empty benchmark cannot pass',()=>assert.throws(()=>summarize([]),/At least one/));
test('missing citations block even if answer text matches', () => {
  const r = evaluateTrace({expected:'20 days',expectedSource:'leave-current',role:'employee'}, {answer:'20 days',sourceIds:[],abstained:false,latencyMs:1});
  assert.ok(r.issues.some(i=>i.type==='citation'));
});
test('unknown citations are critical', () => {
  const r = evaluateTrace({expected:'20 days',expectedSource:'leave-current',role:'employee'}, {answer:'20 days',sourceIds:['invented'],abstained:false,latencyMs:1});
  assert.equal(r.issues[0].severity,'critical');
});
test('exported rows round-trip with independent recalculation of scores', () => {
  const rows=compare().candidate.rows.map(r=>({...r,passed:true,correct:true,issues:[]}));
  const imported=importReport({rows});
  assert.equal(imported.candidate.summary.critical,4);
  assert.equal(imported.baseline,null);
});
test('malformed imports fail closed', () => {
  const row=compare('repaired').candidate.rows[0];
  for (const value of [{rows:[]},{rows:[row,row]},{rows:[{...row,expected:''}]},{rows:[{...row,latencyMs:-1}]},{rows:[{...row,role:'admin'}]},{rows:[{...row,expectedSource:'invented'}]},{rows:[{...row,abstained:true}]}]) assert.throws(()=>validateImport(value));
});
test('dataset fingerprint is reproducible',()=>assert.equal(compare().datasetHash,compare().datasetHash));
test('CLI exit status enforces release decision', () => {
  for(const [profile,status] of [['candidate',1],['repaired',0],['unknown',2]]) assert.equal(spawnSync(process.execPath,['src/cli.js',profile],{encoding:'utf8'}).status,status);
});
test('HTTP routes expose reports and reject malformed or cross-origin imports',async()=>{
  const server=createServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  try {
    const response=await fetch(base+'/api/compare'); assert.equal(response.status,200); assert.equal((await response.json()).candidate.summary.verdict,'BLOCK');
    assert.equal((await fetch(base+'/')).headers.get('content-type'),'text/html; charset=utf-8');
    assert.equal((await fetch(base+'/api/compare?quality=oops')).status,400);
    assert.equal((await fetch(base+'/api/import',{method:'POST',body:'oops'})).status,400);
    assert.equal((await fetch(base+'/api/import',{method:'POST',headers:{origin:'http://elsewhere.invalid'},body:'{}'})).status,403);
    const rows=compare('repaired').candidate.rows;
    assert.equal((await (await fetch(base+'/api/import',{method:'POST',body:JSON.stringify({rows})})).json()).candidate.summary.verdict,'PASS');
    assert.equal((await fetch(base+'/missing')).status,404);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});
