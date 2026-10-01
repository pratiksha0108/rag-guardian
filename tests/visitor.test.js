import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {answerQuestion,evaluateDataset} from '../src/retrieval.js';

function browser() {
  const elements=new Map();
  const element=id=>{if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',value:'',disabled:false,focus(){},scrollIntoView(){}});return elements.get(id);};
  const events={};
  const document={querySelector:element,querySelectorAll:()=>[],addEventListener:(name,fn)=>events[name]=fn};
  const requests=[];
  const fetch=async(path,options)=>{requests.push(path);return {ok:true,json:async()=>options?answerQuestion('salesforce-support',JSON.parse(options.body).question,'agent'):evaluateDataset('salesforce-support')};};
  vm.runInNewContext(readFileSync(new URL('../public/visitor.js',import.meta.url),'utf8'),{document,fetch,window:{scrollTo(){}},setTimeout});
  return {element,requests,send:async question=>{element('#prompt').value=question;await events.submit({target:{id:'chat-form'},preventDefault(){}});},check:async()=>events.click({target:{closest:()=>({id:'check-answer',dataset:{}})}})};
}
test('visitor sends a real search before checking the captured response',async()=>{
  const b=browser();
  await b.send('Which account creation API does ldsCreateRecord use?');
  assert.match(b.element('#conversation').innerHTML,/synthetic customer records/);
  assert.doesNotMatch(b.element('#guardian').innerHTML,/Caught:/);
  await b.check();
  assert.match(b.element('#guardian').innerHTML,/Caught:/);
  assert.equal(b.requests.length,2);
});
test('normal prompt passes and new question is not assigned a fabricated verdict',async()=>{
  const b=browser();
  await b.send('How do I request Salesforce access?');await b.check();
  assert.match(b.element('#guardian').innerHTML,/passes the sample check/);
  await b.send('Tell me about the moon');await b.check();
  assert.match(b.element('#guardian').innerHTML,/No answer key/);
});
test('visitor text is escaped and review storage is never modified',async()=>{
  const b=browser();await b.send('<img src=x onerror=alert(1)>');
  assert.doesNotMatch(b.element('#conversation').innerHTML,/<img/);
  assert.match(b.element('#conversation').innerHTML,/&lt;img/);
  const code=readFileSync(new URL('../public/visitor.js',import.meta.url),'utf8');
  assert.doesNotMatch(code,/localStorage/);
});
