# Working templates

Copy the relevant template into an approved working location. These are blank forms, not completed research or operational records. Keep confidential responses outside this public repository.

## T-01 · Release decision

| Field | Entry |
| --- | --- |
| Assistant ID / purpose / owner | |
| Candidate / baseline revision | |
| Intended change | |
| Engine Git revision | |
| Benchmark version / expected case count / actual count | |
| Source manifest version(s) / dataset fingerprint | |
| Shared policy version / local quality floor | |
| Model and pipeline configuration, if applicable | |
| Run time / evidence report location | |
| Critical cases and affected roles | |
| Correctness numerator/denominator / segment results | |
| Completion/provenance gaps | |
| Engine verdict / human disposition | |
| Reviewer / decision owner / date | |
| Rationale and unresolved risks | |
| Repair owner / follow-up / verification record | |

Human disposition options: hold, request investigation, accept for further testing, or customer-authorized release. In shadow mode, no disposition causes deployment.

## T-02 · Research session

- Participant pseudonym, role, team context, date:
- Consent and approved notes location:
- Number/type of assistants and release responsibility:
- Last concrete release/incident described:
- Current workflow and artifacts observed:
- Direct quote, if permitted:
- Observed behavior:
- Interpretation, clearly separated:
- Prototype task, assistance, errors, time:
- Adoption/integration blocker:
- Evidence contradicting our hypothesis:
- Next question or product decision:

## T-03 · Incident review

- Incident ID / assistant(s) / owner:
- Test-only or live system:
- Reported symptom and restricted evidence location:
- Detection / containment / diagnosis / restoration timestamps:
- Confirmed impact, scope, and remaining unknowns:
- Source, pipeline, model, and policy versions:
- Containment authorized by / action taken:
- Root cause and supporting evidence:
- Shared dependencies and other assistants checked:
- Repair and independent verification:
- Regression cases added:
- Prevention action / owner / target review:
- Closure decision and residual uncertainty:

## T-04 · Product decision record

- Decision ID / date / owner:
- Problem and user evidence:
- Alternatives considered:
- Decision and rationale:
- Tradeoffs and risks accepted:
- What is known vs assumed:
- Evidence or change that would reverse this decision:
- Related use cases / requirements / backlog IDs:
- Next review trigger:

## T-05 · Experiment readout

- Experiment ID and preregistered hypothesis:
- Participant/assistant/task selection:
- Baseline and comparison method:
- Frozen success/continuation criteria:
- Dataset, engine, and policy versions:
- Sample size and exclusions with reasons:
- Counts, denominators, timings, unresolved cases:
- False blocks and missed regressions:
- Observed result:
- Interpretation and confounders:
- Continue / revise / stop decision and owner:
- Claims cleared for public use:

## T-06 · Assistant register

| Assistant ID | Purpose | Release owner | Source manifest | Benchmark | Shared policy | Local quality floor | Last run/status | Evidence access |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| To assign | | | | | | | Unevaluated | |

Keep BLOCK, REVIEW, PASS, and incomplete/unevaluated states separate. The current app supports only the first three engine verdicts and does not store this register.

## T-07 · Benchmark change and adjudication

- Assistant / benchmark old and new versions:
- Added, changed, or retired case IDs:
- Reason and source of truth:
- Original label / proposed label:
- Independent reviewer / disagreements / resolution:
- Development or held-out membership:
- Baseline/candidate reruns needed and completed:
- Approval owner/date and evidence location:
