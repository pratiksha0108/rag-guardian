import { compare } from './engine.js';
const candidate = process.argv[2] || 'candidate';
try {
  const report = compare(candidate);
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.candidate.summary.verdict === 'PASS' ? 0 : 1;
} catch (error) { console.error(error.message); process.exitCode = 2; }
