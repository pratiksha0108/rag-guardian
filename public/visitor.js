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
  document.querySelectorAll('#chat-form button, #prompt, [data-prompt], #check-answer').forEach(el => el.disabled = value);
}
function start() {
  $('#content').innerHTML = `<p class="eyebrow">Try it yourself</p>
    <h1>Ask. Watch. Catch the mistake.</h1>
    <p class="intro">Send the ready-made question to our sample assistant. Then let RAG Guardian check its answer.</p>
    <section class="card chat-card" aria-label="Sample assistant chat">
      <div class="chat-heading"><strong>Salesforce support assistant</strong><span class="tag">Live local search</span></div>
      <p class="muted">Knows made-up company policies. Doesn't know how to write code.</p>
      <div class="prompt-options"><button type="button" data-prompt="mistake">Try a tricky question</button><button type="button" data-prompt="working">Try a normal question</button></div>
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
  if (b.dataset.prompt) {
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
      $('#guardian').innerHTML = `<div class="completion" tabindex="-1" id="verdict"><p class="eyebrow">RAG Guardian</p><h2>${esc(title)}</h2><p>${esc(description)}</p>${same ? `<details><summary>See the expected answer</summary><p>${esc(row.expected === null ? 'Say there is not enough information available to answer.' : row.referenceAnswer)}</p><p class="muted">Prepared sample check, not a guarantee of correctness.</p></details>` : ''}<p class="muted">Try the other suggested question above to compare.</p></div>`;
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
  $('#guardian').innerHTML = '';
  $('#conversation').innerHTML = `<div class="bubble user-bubble"><strong>You</strong><p>${esc(question)}</p></div><p role="status">Assistant is searching its documents…</p>`;
  lock(true);
  $('#send').textContent = 'Searching…';
  try {
    response = await api('/api/datasets/salesforce-support/query', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({question, role:'agent'})});
    $('#conversation').innerHTML = `<div class="bubble user-bubble"><strong>You</strong><p>${esc(question)}</p></div><div class="bubble"><strong>Assistant</strong><p>${esc(response.answer)}</p><small>Exact result from this search</small>${response.chunks.length ? `<details><summary>Source used</summary>${response.chunks.map(c=>`<p>${esc(c.title)}</p>`).join('')}</details>` : ''}</div>`;
    $('#guardian').innerHTML = '<div class="card"><h2>Did it answer your question?</h2><p>You don’t have to decide. Let RAG Guardian check.</p><button class="primary" id="check-answer">Check this answer →</button></div>';
    $('#check-answer').focus();
    $('#conversation').scrollIntoView({block:'start', behavior:'smooth'});
  } catch(err) {
    $('#conversation').innerHTML = '<p>The search could not finish. Your message is still below—try sending it again.</p>';
    $('#message').textContent = err.message;
  } finally { lock(false); $('#send').textContent = 'Send to assistant →'; }
});
start();
