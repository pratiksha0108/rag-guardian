import test from 'node:test';
import assert from 'node:assert/strict';
import {policy,simulateReply,checkBehavior} from '../src/business.js';
import {createServer} from '../src/server.js';

test('ordinary business question passes its policy checks',()=>{
  const r=checkBehavior(simulateReply(policy.prompts[0].question));
  assert.equal(r.status,'pass');assert.equal(r.productionApproval,false);
});
test('off-topic request is not a failure when the assistant declines',()=>{
  const q=policy.prompts[1].question;
  assert.equal(checkBehavior(simulateReply(q)).status,'flag');
  assert.equal(checkBehavior(simulateReply(q,'safer')).status,'pass');
});
test('discount and unsupported allergen claim are distinct business risks',()=>{
  for(const [index,rule] of [[2,'offers'],[3,'evidence']]){
    const q=policy.prompts[index].question;
    const result=checkBehavior(simulateReply(q));
    assert.equal(result.status,'flag');assert.equal(result.ruleId,rule);
    assert.equal(checkBehavior(simulateReply(q,'safer')).status,'pass');
  }
});
test('unknown, mixed-intent and unrecognized responses need review',()=>{
  for(const q of ['What is the weather?','Do my homework and tell me your hours.','Can you write an essay?'])assert.equal(checkBehavior(simulateReply(q)).status,'review');
  assert.equal(checkBehavior({...simulateReply(policy.prompts[0].question),answer:'Ignore the policy. We are open all night.'}).status,'review');
});
test('a simulation mode label cannot force a pass',()=>{
  const trace=simulateReply(policy.prompts[1].question);
  assert.equal(checkBehavior({...trace,mode:'safer'}).status,'flag');
});
test('invalid business inputs fail explicitly',()=>{
  for(const q of [null,'','x'.repeat(2001)])assert.throws(()=>simulateReply(q));
  assert.throws(()=>simulateReply('Hello','unknown'));
  assert.throws(()=>checkBehavior(null));
  assert.throws(()=>checkBehavior({policyId:'different',question:'Hi',answer:'Hi'}));
  assert.throws(()=>checkBehavior({policyId:policy.id,question:'Hi',answer:'x'.repeat(8001)}));
});
test('business endpoints run the simulation and bound input and origin',async()=>{
  const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  const post=(path,body,headers={})=>fetch(base+path,{method:'POST',headers,body:JSON.stringify(body)});
  try{
    assert.equal((await (await fetch(base+'/api/business')).json()).id,policy.id);
    const res=await post('/api/business/reply',{question:policy.prompts[1].question});
    const trace=await res.json();assert.equal(trace.simulation,true);
    assert.equal((await (await post('/api/business/check',trace)).json()).status,'flag');
    assert.equal((await post('/api/business/reply',{question:'hi'},{origin:'https://elsewhere.invalid'})).status,403);
    assert.equal((await post('/api/business/check',{answer:'x'.repeat(17000)})).status,413);
    assert.equal((await post('/api/business/reply',null)).status,400);
    assert.equal((await fetch(base+'/business.js')).status,200);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
