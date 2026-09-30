import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { cases, documents, profiles } from './data.js';

const stop = new Set('the a an is are do does can how what when i to of for in per many must my about much it'.split(' '));
const tokens = text => [...new Set(text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(t => t && !stop.has(t)).map(t => t.replace(/s$/, '')))];

export function retrieve(question, role, profile) {
  const query = tokens(question);
  return documents.filter(d => !profile.omitted.includes(d.id) && (!profile.permissions || d.roles.includes(role)) && (!profile.currentOnly || d.status === 'current'))
    .map(d => ({ ...d, score: query.filter(t => tokens(d.text + ' ' + d.keywords).includes(t)).length + (tokens(d.text).includes(tokens(role)[0]) ? 0.01 : 0) }))
    .filter(d => d.score >= 2)
    .sort((a, b) => b.score - a.score || (profile.preferArchive ? Number(b.status === 'archived') - Number(a.status === 'archived') : 0) || a.id.localeCompare(b.id))
    .slice(0, 1);
}

export function evaluateTrace(test, trace, sources = documents) {
  const cited = trace.sourceIds.map(id => sources.find(d => d.id === id));
  const issues = [];
  if (cited.some(d => !d)) issues.push({ type: 'citation', severity: 'critical', reason: 'A cited source does not exist in the supplied corpus.', fix: 'Validate source IDs before returning an answer.' });
  if (cited.some(d => d && !d.roles.includes(test.role))) issues.push({ type: 'permission', severity: 'critical', reason: 'Retrieved evidence is not authorized for this user role.', fix: 'Apply role filters before retrieval and before returning citations.' });
  if (cited.some(d => d?.status === 'archived')) issues.push({ type: 'freshness', severity: 'critical', reason: 'This answer relies on a document marked archived.', fix: 'Exclude archived versions from the active retrieval index.' });
  const correct = test.expected === null ? trace.abstained : !trace.abstained && trace.answer.toLowerCase().includes(test.expected.toLowerCase()) && trace.sourceIds.includes(test.expectedSource);
  if (!correct && !issues.length) issues.push({ type: trace.abstained ? 'coverage' : 'answer', severity: 'warning', reason: trace.abstained ? 'Expected evidence was not retrieved; the pipeline abstained.' : 'The answer does not match the expected phrase and source.', fix: trace.abstained ? 'Check index coverage and query matching for the expected source.' : 'Review the expected answer and generation trace with a human reviewer.' });
  if (!trace.abstained && !trace.sourceIds.length) issues.push({ type: 'citation', severity: 'critical', reason: 'A non-abstained answer has no citation.', fix: 'Require a verifiable citation or abstain.' });
  return { ...test, ...trace, correct, issues, passed: correct && issues.length === 0 };
}

export function summarize(rows, minQuality = 80) {
  if (!rows.length) throw new Error('At least one evaluation case is required.');
  const quality = Math.round(rows.filter(r => r.correct).length / rows.length * 100);
  const critical = rows.filter(r => r.issues.some(i => i.severity === 'critical')).length;
  const warnings = rows.filter(r => r.issues.some(i => i.severity === 'warning')).length;
  const verdict = critical ? 'BLOCK' : quality < minQuality ? 'REVIEW' : 'PASS';
  const latencies = rows.map(r => r.latencyMs).sort((a, b) => a - b);
  return { total: rows.length, quality, critical, warnings, passed: rows.filter(r => r.passed).length, verdict, minQuality, p95Ms: latencies[Math.ceil(latencies.length * .95) - 1], segments: [...new Set(rows.map(r => r.segment))].map(name => { const subset = rows.filter(r => r.segment === name); return { name, passed: subset.filter(r => r.passed).length, total: subset.length }; }) };
}

export function runProfile(id, minQuality = 80) {
  const profile = profiles[id];
  if (!profile) throw new Error('Unknown release profile.');
  const rows = cases.map(test => {
    const start = performance.now();
    const retrieved = retrieve(test.question, test.role, profile);
    const answer = retrieved.length ? retrieved.map(d => d.text).join('\n') : 'I do not have sufficient authorized evidence to answer.';
    return evaluateTrace(test, { answer, sourceIds: retrieved.map(d => d.id), abstained: !retrieved.length, latencyMs: Number((performance.now() - start).toFixed(3)) });
  });
  return { id, name: profile.name, rows, summary: summarize(rows, minQuality) };
}

export function compare(candidate = 'candidate', minQuality = 80) {
  if (!Number.isInteger(minQuality) || minQuality < 0 || minQuality > 100) throw new Error('Quality threshold must be an integer from 0 to 100.');
  return { schemaVersion: 1, mode: 'synthetic-extractive', createdAt: new Date().toISOString(), datasetHash: createHash('sha256').update(JSON.stringify({ cases, documents, profiles })).digest('hex').slice(0, 12), baseline: runProfile('baseline', minQuality), candidate: runProfile(candidate, minQuality) };
}

export function validateImport(input) {
  if (!input || !Array.isArray(input.rows) || input.rows.length < 1 || input.rows.length > 1000) throw new Error('Provide 1–1000 rows. See docs/trace-format.md.');
  const ids = new Set();
  for (const row of input.rows) {
    if (!row || ['id', 'question', 'role', 'segment', 'answer'].some(k => typeof row[k] !== 'string' || !row[k].trim() || row[k].length > 20000)) throw new Error('Each row needs non-empty id, question, role, segment, and answer strings.');
    if (ids.has(row.id)) throw new Error('Case IDs must be unique.');
    ids.add(row.id);
    if (!['employee', 'contractor', 'manager'].includes(row.role)) throw new Error('Unknown role. Use employee, contractor, or manager.');
    if (typeof row.abstained !== 'boolean' || !Array.isArray(row.sourceIds) || row.sourceIds.some(s => typeof s !== 'string') || row.sourceIds.length > 50) throw new Error('Each row needs abstained and sourceIds.');
    if (row.expected !== null && (typeof row.expected !== 'string' || !row.expected.trim())) throw new Error('expected must be a non-empty phrase or null.');
    if (row.expected === null ? row.expectedSource !== null : !documents.some(d => d.id === row.expectedSource)) throw new Error('expectedSource must match a corpus document, or be null when expected is null.');
    if (typeof row.latencyMs !== 'number' || !Number.isFinite(row.latencyMs) || row.latencyMs < 0) throw new Error('latencyMs must be a finite non-negative number.');
    if (row.abstained && row.sourceIds.length) throw new Error('Abstained traces must have no source IDs.');
  }
  return input.rows;
}

export function importReport(input, minQuality = 80) {
  const rows = validateImport(input).map(row => evaluateTrace(row, row));
  return { schemaVersion: 1, mode: 'imported-traces', createdAt: new Date().toISOString(), datasetHash: createHash('sha256').update(JSON.stringify(input.rows)).digest('hex').slice(0, 12), baseline: null, candidate: { id: 'imported', name: 'Imported traces', rows, summary: summarize(rows, minQuality) } };
}
