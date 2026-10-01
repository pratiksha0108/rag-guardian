const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let policy, trace, busy=false, history=[];
async function api(path,value){const res=await fetch(path,value===undefined?undefined:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});const b=await res.json();if(!res.ok)throw Error(b.error||'Please try again.');return b;}
function lock(on){busy=on;document.querySelectorAll('main button, main textarea').forEach(b=>b.disabled=on);}
function reset(){trace=null;$('#exchange').innerHTML='';$('#result').innerHTML='';$('#compose').hidden=false;$('#prompt').value='';$('#message').textContent='';$('#prompt').focus();}
function render(){
  $('#content').innerHTML=`<h1>Is your assistant doing its job?</h1><p class="intro">Try a café assistant. See when it helps and when it goes too far.</p>
  <section class="source-panel"><div class="chat-heading"><strong>${esc(policy.name)} · business rules</strong><span class="tag">Fictional business</span></div><p>${esc(policy.job)}</p><details><summary>View approved information</summary>${policy.rules.map(r=>`<p><strong>${esc(r.title)}</strong><br>${esc(r.text)}</p>`).join('')}<p class="muted">Stored in <code>src/business.js</code> in this project. No policy uploads or live business connection.</p></details></section>
  <section class="card chat-card" aria-label="Business assistant demo"><div class="chat-heading"><strong>Café assistant</strong><span class="tag warning">Scripted simulation</span></div>
  <div id="exchange" aria-live="polite"></div><div id="result" aria-live="polite"></div>
  <form id="compose"><div class="prompt-options">${policy.prompts.map(p=>`<button type="button" data-prompt="${p.id}">${esc(p.label)}</button>`).join('')}</div><label for="prompt">Ask the assistant</label><textarea id="prompt" rows="2" maxlength="2000" required>${esc(policy.prompts[1].question)}</textarea><p class="muted">Start with homework. The assistant’s job is café support.</p><button class="primary wide" type="submit">Send to sample assistant →</button></form></section>
  <details><summary>What would the business learn?</summary><p>Which requests lead to off-task work, unauthorized promises, or unsupported answers. A correct refusal is not a failure.</p><div id="session-summary">Run a check to see findings from this session.</div><p class="muted">This session only. Nothing is monitored in production. No usage-cost or savings claims.</p><button id="export">Download session evidence</button></details>
  <p class="muted">Free prototype: scripted replies, real rule checks. No LLM, payment, or real order. New wording may need review; these narrow checks do not prove general safety.</p>`;
}
async function send(question,mode='unguarded'){
  lock(true);$('#message').textContent='';$('#compose').hidden=true;$('#result').innerHTML='';$('#exchange').innerHTML='<p role="status">Running sample assistant…</p>';
  try{trace=await api('/api/business/reply',{question,mode});$('#exchange').innerHTML=`<p class="muted">${mode==='safer'?'Safer scripted behavior · same question':'Intentionally flawed sample behavior'}</p><div class="bubble user-bubble"><strong>You</strong><p>${esc(trace.question)}</p></div><div class="bubble"><strong>Sample assistant</strong><p>${esc(trace.answer)}</p></div><div class="check-actions"><button class="primary" id="check">Check with Guardian →</button><button id="new">New question</button></div>`;$('#check').focus();}catch(e){$('#message').textContent=e.message;$('#exchange').innerHTML='';$('#compose').hidden=false;}finally{lock(false);}
}
document.addEventListener('submit',async e=>{if(e.target.id!=='compose')return;e.preventDefault();if(!busy&&$('#prompt').value.trim())await send($('#prompt').value.trim());});
document.addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b||busy)return;
  if(b.dataset.prompt){$('#prompt').value=policy.prompts.find(p=>p.id===b.dataset.prompt).question;$('#prompt').focus();return;}
  if(b.id==='new'){reset();return;}
  if(b.id==='safer'){await send(trace.question,'safer');return;}
  if(b.id==='check'){
    lock(true);$('#message').textContent='';
    try{const finding=await api('/api/business/check',trace);history.push({...trace,finding,checkedAt:new Date().toISOString()});const transcript=`<p><strong>You:</strong> ${esc(trace.question)}</p><p><strong>Assistant:</strong> ${esc(trace.answer)}</p>`;$('#exchange').innerHTML='';
      $('#result').innerHTML=`<div class="completion ${finding.status==='flag'?'result-warning':''}" id="verdict" tabindex="-1"><p class="eyebrow">Guardian · ${esc(finding.status==='pass'?'sample check passed':finding.status==='flag'?'business risk found':'review needed')}</p><h2>${esc(finding.title)}</h2><p>${esc(finding.reason)}</p><details><summary>Evidence and business rule</summary>${transcript}<p><strong>Rule:</strong> ${esc(policy.rules.find(r=>r.id===finding.ruleId).text)}</p><p><strong>Team action:</strong> ${esc(finding.next)}</p></details></div><div class="actions">${finding.status==='flag'&&trace.mode==='unguarded'?'<button class="primary" id="safer">Try safer behavior →</button>':''}<button id="new">New question</button></div>${finding.status==='flag'?'<p class="muted">Guardian detected this; it did not block the original reply. “Safer behavior” switches to a prepared response, not an automatic fix.</p>':''}`;
      $('#session-summary').innerHTML=`<p>${history.length} checks this session: ${history.filter(h=>h.finding.status==='flag').length} flagged, ${history.filter(h=>h.finding.status==='pass').length} passed, ${history.filter(h=>h.finding.status==='review').length} need review. Repeated checks count separately.</p>`;$('#verdict').focus();$('#verdict').scrollIntoView({block:'nearest'});
    }catch(err){$('#message').textContent=err.message;}finally{lock(false);}return;
  }
  if(b.id==='export'){const u=URL.createObjectURL(new Blob([JSON.stringify({policy,simulation:true,productionMonitoring:false,checks:history},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='guardian-business-demo.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
});
try{policy=await api('/api/business');render();}catch(e){$('#content').textContent='The demo could not load. Refresh to try again.';$('#message').textContent=e.message;}
