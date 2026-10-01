import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {policy,simulateReply,checkBehavior} from '../src/business.js';

test('business UI runs flawed and safer replies, counts checks and clears old results',async()=>{
  const elements=new Map(),events={};
  const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',value:'',textContent:'',hidden:false,focus(){},scrollIntoView(){}});return elements.get(id);};
  const document={querySelector:element,querySelectorAll:()=>[],addEventListener:(n,f)=>events[n]=f};
  const fetch=async(path,options)=>({ok:true,json:async()=>{const input=options?JSON.parse(options.body):null;return path==='/api/business'?policy:path.endsWith('/reply')?simulateReply(input.question,input.mode):checkBehavior(input);}});
  await vm.runInNewContext('(async()=>{'+readFileSync(new URL('../public/business.js',import.meta.url),'utf8')+'})()',{document,fetch,setTimeout});
  const click=id=>events.click({target:{closest:()=>({id,dataset:{}})}});
  element('#prompt').value=policy.prompts[1].question;
  await events.submit({target:{id:'compose'},preventDefault(){}});
  assert.match(element('#exchange').innerHTML,/96/);
  await click('check');assert.match(element('#result').innerHTML,/Off-task work/);
  await click('safer');assert.match(element('#exchange').innerHTML,/cannot do homework/);
  await click('check');assert.match(element('#result').innerHTML,/Stayed on task/);
  assert.match(element('#session-summary').innerHTML,/2 checks this session: 1 flagged, 1 passed/);
  await click('new');assert.equal(element('#result').innerHTML,'');assert.equal(element('#exchange').innerHTML,'');assert.equal(element('#prompt').value,'');
});
