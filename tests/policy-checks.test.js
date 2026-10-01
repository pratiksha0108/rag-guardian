import test from 'node:test';
import assert from 'node:assert/strict';
import {changes,runSuite,evaluateReply} from '../src/policy-checks.js';
test('both policy changes expose stale replies and preserve unchanged cases',()=>{
 for(const id of Object.keys(changes)){const result=runSuite(id,'old');assert.equal(result.passed,1);assert.equal(result.total,3);assert.equal(result.productionApproval,false);}
});
test('stricter guardrails fail legitimate requests; updated fixtures pass',()=>{
 for(const id of Object.keys(changes)){assert.equal(runSuite(id,'strict').passed,0);assert.equal(runSuite(id,'fixed').passed,3);assert.deepEqual(runSuite(id,'old').rows.map(r=>r.question),runSuite(id,'fixed').rows.map(r=>r.question));}
});
test('unknown replies require review and invalid configurations are rejected',()=>{
 assert.equal(evaluateReply(changes.refunds.cases[0],'Something unexpected').status,'review');
 assert.throws(()=>runSuite('unknown','old'));assert.throws(()=>runSuite('refunds','magic'));
});
