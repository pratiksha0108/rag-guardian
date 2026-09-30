# Operating model and decision rights

Status: proposed for a supervised pilot. These are responsibilities to assign, not a claim that a staffed team exists. The product lead may perform several roles initially; use an independent reviewer for benchmark and release validation where possible.

## Roles

| Role | Accountable for | Required record |
| --- | --- | --- |
| Product lead | Customer hypothesis, scope, prioritization, learning | PRD and decision log |
| Platform lead | Shared rules, assistant register, cross-assistant triage | Policy versions and named assistant owners |
| Release owner | Actual ship/hold decision in the customer's process | Signed/attributed release record |
| Pipeline engineer | Reproducible runs and repair implementation | Change revision and evidence report |
| Evaluation lead | Benchmark quality and scoring validity | Label review and evaluation readout |
| Knowledge owner | Source authority, current versions, permitted use | Source manifest and approvals |
| Security reviewer | Suspected exposure and permission validity | Restricted incident record |

The application does not authenticate these roles or implement approvals. Its `employee`, `contractor`, and `manager` values describe synthetic question actors; they are not operating permissions for Guardian users.

Maintain an assistant register with ID, purpose, accountable release owner, source manifest, benchmark version, shared policy version, local thresholds, data sensitivity, and last evaluation status. Keep separate records for each assistant. No aggregate PASS may override an individual BLOCK or incomplete evaluation. A manual register is sufficient for the first supervised pilot; the application does not implement it yet.

## Who makes which decision?

| Decision | Accountable | Performs work | Consulted |
| --- | --- | --- | --- |
| Prioritize next use case | Product lead | Product lead | Pilot users, engineer |
| Approve source material | Knowledge owner | Knowledge owner | Security reviewer |
| Approve benchmark labels | Evaluation lead | Independent label reviewer | Knowledge owner |
| Change a release threshold | Release owner | Evaluation lead | Product lead, security reviewer |
| Change a shared critical rule | Platform lead | Evaluation lead | Every affected release owner, security reviewer |
| Approve a customer release | Release owner | Pipeline engineer | Evaluation lead, security reviewer for access findings |
| Contain a suspected exposure | Customer incident owner | Pipeline engineer | Security reviewer, knowledge owner |
| Publish a case study | Product lead | Product lead | Data owners for any customer material |

## Operating cadence

- Per candidate: follow release SOP, retain original report, record disposition.
- Weekly during discovery/pilot: review observed user problems, false blocks, missed failures, open risks, and the next learning experiment. Do not count demo reruns as adoption.
- At each benchmark/source change: version inputs and obtain label/authority review.
- At milestone completion: compare evidence against the gate in the pilot plan and update the roadmap.

## Exceptions

Do not turn BLOCK into PASS by relabeling a finding or silently changing a threshold. If a label is wrong, preserve the original report, adjudicate the correction, version the benchmark, and rerun. Proposed pilot policy: confirmed permission/citation failures have no automatic override. The customer's incident/release owner controls real system actions; this repository cannot authorize them.

If no independent reviewer is available, record that limitation and keep evaluation in shadow mode. If evidence is unavailable, the decision is incomplete rather than approved.
