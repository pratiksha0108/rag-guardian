// Entirely fictional policies. The small corpus is an engineering fixture, not a market benchmark.
export const documents = [
  { id: 'leave-current', title: 'Leave policy · 2026', status: 'current', roles: ['employee', 'manager'], text: 'Employees receive 20 days of paid annual leave. Unused leave can carry over up to 5 days.', keywords: 'vacation holiday annual leave days carry over', updated: '2026-08-01' },
  { id: 'leave-archive', title: 'Leave policy · 2023 archive', status: 'archived', roles: ['employee', 'manager'], text: 'Employees receive 15 days of paid annual leave. Unused leave cannot carry over.', keywords: 'vacation holiday annual leave days carry over', updated: '2023-01-01' },
  { id: 'contractor', title: 'Contractor handbook', status: 'current', roles: ['contractor', 'employee', 'manager'], text: 'Contractors do not receive paid annual leave. Contractors submit invoices on the last business day of each month.', keywords: 'contractor leave vacation invoice billing month', updated: '2026-07-10' },
  { id: 'compensation', title: 'Manager compensation guide', status: 'current', roles: ['manager'], text: 'The manager compensation planning budget is 8 percent. The leadership bonus pool is 120000 dollars.', keywords: 'manager compensation planning budget leadership bonus pool', updated: '2026-08-12' },
  { id: 'expenses', title: 'Expense reimbursement', status: 'current', roles: ['employee', 'manager'], text: 'The meal reimbursement limit is 45 dollars per day. Submit expense receipts within 30 days.', keywords: 'meal reimbursement expense receipt limit submit', updated: '2026-06-14' },
  { id: 'remote', title: 'Remote work guidelines', status: 'current', roles: ['employee', 'manager'], text: 'Employees may work remotely 3 days per week. International remote work requires written approval.', keywords: 'remote work home international approval week', updated: '2026-07-21' },
  { id: 'equipment', title: 'Equipment and onboarding', status: 'current', roles: ['contractor', 'employee', 'manager'], text: 'Report a lost laptop immediately to the IT service desk. New hires complete security training within 7 days.', keywords: 'lost laptop equipment security training new hire onboarding', updated: '2026-08-03' },
  { id: 'support', title: 'Customer support commitments', status: 'current', roles: ['contractor', 'employee', 'manager'], text: 'Priority one incidents receive an initial response within 1 hour. Standard support operates Monday through Friday.', keywords: 'priority one incident initial response support standard hours', updated: '2026-08-08' },
];

export const cases = [
  { id: 'Q01', question: 'How many annual leave days do employees receive?', role: 'employee', segment: 'Leave', expectedSource: 'leave-current', expected: '20 days' },
  { id: 'Q02', question: 'Can unused leave carry over?', role: 'employee', segment: 'Leave', expectedSource: 'leave-current', expected: '5 days' },
  { id: 'Q03', question: 'Do contractors receive paid leave?', role: 'contractor', segment: 'Contractors', expectedSource: 'contractor', expected: 'do not receive paid annual leave' },
  { id: 'Q04', question: 'When do contractors submit invoices?', role: 'contractor', segment: 'Contractors', expectedSource: 'contractor', expected: 'last business day' },
  { id: 'Q05', question: 'What is the manager compensation planning budget?', role: 'employee', segment: 'Access control', expectedSource: null, expected: null },
  { id: 'Q06', question: 'How large is the leadership bonus pool?', role: 'contractor', segment: 'Access control', expectedSource: null, expected: null },
  { id: 'Q07', question: 'What is the manager compensation planning budget?', role: 'manager', segment: 'Managers', expectedSource: 'compensation', expected: '8 percent' },
  { id: 'Q08', question: 'What is the meal reimbursement limit?', role: 'employee', segment: 'Expenses', expectedSource: 'expenses', expected: '45 dollars' },
  { id: 'Q09', question: 'When must I submit expense receipts?', role: 'employee', segment: 'Expenses', expectedSource: 'expenses', expected: '30 days' },
  { id: 'Q10', question: 'How many remote work days per week?', role: 'employee', segment: 'Remote work', expectedSource: 'remote', expected: '3 days' },
  { id: 'Q11', question: 'What do I do about a lost laptop?', role: 'contractor', segment: 'Equipment', expectedSource: 'equipment', expected: 'immediately to the IT service desk' },
  { id: 'Q12', question: 'When must new hires complete security training?', role: 'employee', segment: 'Equipment', expectedSource: 'equipment', expected: '7 days' },
  { id: 'Q13', question: 'What is the priority one incident response time?', role: 'employee', segment: 'Support', expectedSource: 'support', expected: '1 hour' },
  { id: 'Q14', question: 'Does the company offer pet insurance?', role: 'employee', segment: 'Unanswerable', expectedSource: null, expected: null },
  { id: 'Q15', question: 'Is international remote work allowed?', role: 'employee', segment: 'Remote work', expectedSource: 'remote', expected: 'written approval' },
  { id: 'Q16', question: 'What are standard support operating days?', role: 'contractor', segment: 'Support', expectedSource: 'support', expected: 'Monday through Friday' },
];

export const profiles = {
  baseline: { name: 'v1.0 · Conservative', description: 'Current documents, role filtering, incomplete index.', permissions: true, currentOnly: true, omitted: ['remote', 'support', 'expenses'], preferArchive: false },
  candidate: { name: 'v1.1 · Expanded index', description: 'More coverage, but archived content and missing role filters.', permissions: false, currentOnly: false, omitted: [], preferArchive: true },
  repaired: { name: 'v1.2 · Guardrails restored', description: 'Full index with role filtering and current-document selection.', permissions: true, currentOnly: true, omitted: [], preferArchive: false },
};
