const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prompts = {
  mistake: 'Which account creation API does ldsCreateRecord use?',
  working: 'How do I request Salesforce access?'
};
let response = null;
let busy = false;
async function api(path, options) {
  const res = await fetch(path, options);
  const body = await res.json();
  if (!res.ok) throw Error(body.error || 'Something went wrong. Please try again.');
  return body;
}
function lock(value) {
  busy = value;
  document.querySelectorAll('#chat-form button, #prompt, [data-prompt], #check-answer, #new-question').forEach(el => el.disabled = value);
}
function resetQuestion() {
  response = null;
  $('#conversation').innerHTML = '';
  $('#conversation').hidden = false;
  $('#guardian').innerHTML = '';
  $('#chat-form').hidden = false;
  $('#suggestions').hidden = false;
  $('#message').textContent = '';
  $('#prompt').value = '';
  $('#prompt-help').textContent = 'Choose an example above, or write your own question.';
  $('#prompt').focus();
}
function start() {
  $('#content').innerHTML = `<h1>Test an assistant’s answer.</h1>
    <p class="intro">Choose a question. See the answer. Check it with Guardian.</p>
    <section class="source-panel" aria-label="Data source">
      <div class="chat-heading"><div><p class="eyebrow">Data source</p><strong>Sample company policies</strong></div><button id="view-policies" aria-expanded="false" aria-controls="policy-content">View policies</button></div>
      <p class="muted">6 fictional policies · stored in this project · ready to use</p>
      <div id="policy-content" hidden></div>
      <p class="source-note">Using the included sample. Policy uploads aren’t supported yet.</p>
    </section>
    <section class="card chat-card" aria-label="Sample assistant chat">
      <div class="chat-heading"><strong>Salesforce support assistant</strong><span class="tag">Sample chat</span></div>
      <div class="prompt-options" id="suggestions"><button type="button" data-prompt="mistake">Tricky question</button><button type="button" data-prompt="working">Normal question</button></div>
      <div id="conversation" aria-live="polite"></div>
      <section id="guardian" aria-live="polite"></section>
      <form id="chat-form"><label for="prompt">Your message</label><textarea id="prompt" rows="2" required maxlength="2000">${prompts.mistake}</textarea>
      <p class="muted" id="prompt-help">This asks how a piece of code creates an account. No coding knowledge needed—just press Send.</p>
      <button class="primary wide" type="submit" id="send">Send to assistant →</button></form>
    </section>
    <details><summary>What am I trying?</summary><p>This is a real document-search demo, not a connected Salesforce agent or a generative chatbot. Each Send searches six fictional company policies and returns the excerpt it finds. No paid AI model is used.</p><p>The two suggested prompts have prepared answer checks. You can edit the message, but a new question may not have an answer key. Each message is a separate search; it does not train or change the assistant.</p><p>Answer keys were checked by AI, not independently human-validated. No customer data or production-release approval is involved.</p></details>`;
}
document.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b || busy) return;
  if (b.id === 'new-question') { resetQuestion(); return; }
  if (b.id === 'view-policies') {
    const panel = $('#policy-content');
    if (!panel.hidden) { panel.hidden = true; b.setAttribute('aria-expanded','false'); b.textContent = 'View policies'; return; }
    b.disabled = true;
    try {
      const dataset = await api('/api/datasets/salesforce-support');
      panel.innerHTML = '<p class="muted">These are made-up Northstar policies, not official Salesforce guidance. Archived policies and role restrictions affect which documents a search may use.</p>' + dataset.documents.map(d=>`<details><summary>${esc(d.title)} · ${esc(d.status)}</summary><p>${esc(d.text)}</p><p class="muted">Available to: ${esc(d.roles.join(', '))}</p></details>`).join('') + '<p class="muted">Saved in <code>datasets/salesforce-support/corpus.json</code> in the project. The local server reads this file; no Salesforce connection is used.</p><a href="https://github.com/pratiksha0108/rag-guardian/blob/main/datasets/salesforce-support/corpus.json" target="_blank" rel="noreferrer">View the source file on GitHub</a>';
      panel.hidden = false; b.setAttribute('aria-expanded','true'); b.textContent = 'Hide policies';
    } catch(err) { $('#message').textContent = 'Could not load the policies. Please try again.'; }
    finally { b.disabled = false; }
    return;
  }
  if (b.dataset.prompt) {
    resetQuestion();
    $('#prompt').value = prompts[b.dataset.prompt];
    $('#prompt-help').textContent = b.dataset.prompt === 'mistake'
      ? 'This asks how a piece of code creates an account. No coding knowledge needed—just press Send.'
      : 'This is a workplace question the assistant should be able to answer. Press Send to compare.';
    $('#prompt').focus();
  }
  if (b.id === 'check-answer' && response) {
    lock(true);
    b.textContent = 'Checking this response…';
    try {
      const report = await api('/api/datasets/salesforce-support/evaluate');
      const row = report.rows.find(r => r.question.trim().toLowerCase() === response.question.trim().toLowerCase() && r.role === response.role);
      const same = row && report.datasetHash === response.datasetHash && row.answer === response.answer && JSON.stringify(row.sourceIds) === JSON.stringify(response.sourceIds);
      let title = 'No answer key for this question yet';
      let description = 'The search ran, but RAG Guardian cannot mark a new question right or wrong using these prepared tests. Try one of the suggested prompts to see an automatic check.';
      if (same) {
        title = row.passed ? 'This answer passes the sample check' : 'Caught: this answer misses the question';
        description = row.id === 'SUP-07' && !row.passed && response.sourceIds[0] === 'salesforce-support:sandbox'
          ? 'You asked about code. The assistant returned rules about test data. Those rules do not answer your question—it should have said it did not know.'
          : row.passed ? 'The response matches the prepared answer and source checks for this question.' : 'The response does not match the prepared answer or source for this question.';
      }
      const conversation = $('#conversation').innerHTML;
      $('#conversation').innerHTML = '';
      $('#guardian').innerHTML = `<div class="completion ${same && !row.passed ? 'result-warning' : ''}" tabindex="-1" id="verdict"><p class="eyebrow">Guardian result</p><h2>${esc(title)}</h2><p>${esc(description)}</p><details><summary>View conversation</summary>${conversation}</details>${same ? `<details><summary>Expected answer</summary><p>${esc(row.expected === null ? 'Say there is not enough information available to answer.' : row.referenceAnswer)}</p><p class="muted">Prepared sample check, not a guarantee of correctness.</p></details>` : ''}</div><button class="primary wide" id="new-question">New question</button>`;
      $('#verdict').focus();
      $('#verdict').scrollIntoView({block:'nearest', behavior:'smooth'});
    } catch (err) { $('#message').textContent = err.message; b.textContent = 'Check this answer'; }
    finally { lock(false); }
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'prompt') $('#prompt-help').textContent = 'Your own question runs a real search. Automatic grading is available only for prepared questions.';
});
document.addEventListener('submit', async e => {
  if (e.target.id !== 'chat-form') return;
  e.preventDefault();
  if (busy) return;
  const question = $('#prompt').value.trim();
  if (!question) { $('#prompt').focus(); return; }
  response = null;
  $('#message').textContent = '';
  $('#chat-form').hidden = true;
  $('#suggestions').hidden = true;
  $('#guardian').innerHTML = '';
  $('#conversation').innerHTML = `<div class="bubble user-bubble"><strong>You</strong><p>${esc(question)}</p></div><p role="status">Assistant is searching its documents…</p>`;
  lock(true);
  $('#send').textContent = 'Searching…';
  try {
    response = await api('/api/datasets/salesforce-support/query', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({question, role:'agent'})});
    $('#conversation').innerHTML = `<div class="bubble user-bubble"><strong>You</strong><p>${esc(question)}</p></div><div class="bubble"><strong>Assistant</strong><p>${esc(response.answer)}</p><small>Exact result from this search</small>${response.chunks.length ? `<details><summary>Source used</summary>${response.chunks.map(c=>`<p>${esc(c.title)}</p>`).join('')}</details>` : ''}</div>`;
    $('#guardian').innerHTML = '<div class="check-actions"><button class="primary" id="check-answer">Check this answer →</button><button id="new-question">New question</button></div>';
    $('#check-answer').focus();
    $('#conversation').scrollIntoView({block:'start', behavior:'smooth'});
  } catch(err) {
    $('#conversation').innerHTML = '<p>The search could not finish. Your message is still below—try sending it again.</p>';
    $('#message').textContent = err.message;
    $('#chat-form').hidden = false;
    $('#suggestions').hidden = false;
  } finally { lock(false); $('#send').textContent = 'Send to assistant →'; }
});
start();
