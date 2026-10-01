// Small local BM25 baseline. No network calls, paid API, or source execution.
import { performance } from 'node:perf_hooks';
import { readFileSync } from 'node:fs';
import { loadDataset, digest } from './datasets.js';
import { evaluateTrace, summarize } from './engine.js';

export const RETRIEVAL_VERSION = 'bm25-lines-v1';
const implementationHash = digest(['retrieval.js','datasets.js','engine.js'].map(file=>readFileSync(new URL(file,import.meta.url),'utf8')).join('\n'));
const stop = new Set('a an the is are was were do does did can could would should how what which where when why i we you it its to of for in on from this that with and or as at by before after'.split(' '));
function tokenize(text) { return text.replace(/([a-z])([A-Z])/g,'$1 $2').toLowerCase().split(/[^a-z0-9]+/).filter(t=>t.length>1&&!stop.has(t)).map(t=>t.replace(/s$/,'')); }

export function chunkDocuments(documents) {
  return documents.flatMap(doc=>(doc.sourceFiles || [{path:doc.id,text:doc.text,url:null}]).flatMap(file=>{
    const lines=file.text.split('\n'); const chunks=[];
    for(let start=0;start<lines.length;start+=30) {
      const end=Math.min(start+35,lines.length); const text=lines.slice(start,end).join('\n');
      if(text.trim()) chunks.push({id:`${doc.id}:${file.path}:${start+1}`,sourceId:doc.id,assistantId:doc.assistantId,title:doc.title,status:doc.status,roles:doc.roles,text,path:file.path,startLine:start+1,endLine:end,url:file.url ? `${file.url}#L${start+1}-L${end}` : null});
      if(end===lines.length) break;
    }
    return chunks;
  }));
}

export function retrieveChunks(question, role, dataset) {
  const chunks=chunkDocuments(dataset.documents).filter(c=>c.assistantId===dataset.assistant.id && c.status==='current' && c.roles.includes(role));
  const query=[...new Set(tokenize(question))];
  const indexed=chunks.map(c=>({...c,tokens:tokenize(c.title+' '+c.text)}));
  const avg=indexed.reduce((n,c)=>n+c.tokens.length,0)/(indexed.length||1);
  return indexed.map(c=>{
    let score=0,matched=0;
    for(const term of query) {
      const tf=c.tokens.filter(t=>t===term).length;
      if(!tf) continue;
      matched++;
      const df=indexed.filter(d=>d.tokens.includes(term)).length;
      const idf=Math.log(1+(indexed.length-df+.5)/(df+.5));
      score+=idf*tf*2.2/(tf+1.2*(.25+.75*c.tokens.length/(avg||1)));
    }
    const {tokens,...chunk}=c;
    return {...chunk,score:Number(score.toFixed(5)),matchedTerms:matched};
  }).filter(c=>c.matchedTerms>=2).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,1);
}

export function answerQuestion(assistantId, question, role) {
  const dataset=loadDataset(assistantId);
  if(typeof question!=='string'||!question.trim()||question.length>2000) throw new Error('Enter a question of 1–2000 characters.');
  if(!dataset.assistant.roles.includes(role)) throw new Error('Role does not belong to this assistant.');
  const start=performance.now();
  const chunks=retrieveChunks(question,role,dataset);
  return {assistantId,question,role,mode:'extractive-bm25',answer:chunks.length?chunks.map(c=>c.text).join('\n\n'):'No matching authorized evidence was found in this small corpus.',abstained:!chunks.length,sourceIds:chunks.map(c=>c.sourceId),chunks,latencyMs:Number((performance.now()-start).toFixed(3)),datasetHash:dataset.datasetHash,retrievalVersion:RETRIEVAL_VERSION};
}

export function evaluateDataset(assistantId, split='dev') {
  const dataset=loadDataset(assistantId,split);
  const rows=dataset.cases.map(test=>{
    const start=performance.now();
    const chunks=retrieveChunks(test.question,test.role,dataset);
    const trace={answer:chunks.length?chunks.map(c=>c.text).join('\n\n'):'No matching authorized evidence was found in this small corpus.',sourceIds:chunks.map(c=>c.sourceId),abstained:!chunks.length,chunks,latencyMs:Number((performance.now()-start).toFixed(3))};
    return evaluateTrace(test,trace,dataset.documents);
  });
  const metrics=summarize(rows);
  return {assistantId,split,mode:'extractive-bm25',benchmarkVersion:dataset.benchmarkVersion,datasetHash:dataset.datasetHash,retrievalVersion:RETRIEVAL_VERSION,implementationHash,configuration:{chunkLines:35,overlapLines:5,topK:1,k1:1.2,b:.75,minMatchedTerms:2},experimentFingerprint:digest(JSON.stringify({assistantId,split,hash:dataset.datasetHash,implementationHash})).slice(0,16),createdAt:new Date().toISOString(),provenance:dataset.provenance,rows,summary:{...metrics,mechanicalVerdict:metrics.verdict,verdict:metrics.verdict==='BLOCK'?'BLOCK':'REVIEW',reviewedCases:0,readiness:'Draft benchmark: human review pending. No release approval.'}};
}
