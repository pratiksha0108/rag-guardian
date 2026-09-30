# Metrics and experiment plan

Status: proposed pilot measurement design. The application does not collect user telemetry or business outcomes today. Use manual records first. Never mix synthetic fixture metrics with customer metrics.

## Product outcome

Primary pilot outcome: **time to a verified diagnosis for release failures**, compared with each team's existing workflow. Pair it with decision quality and false-block burden so speed cannot improve by making careless judgments.

For the multi-assistant direction, also measure whether onboarding the second assistant reuses evaluation work and whether eligible releases actually receive review. A cross-assistant mean must not conceal an unsafe release or an unevaluated assistant.

| Metric | Definition / denominator | Collection and interpretation |
| --- | --- | --- |
| Diagnosis time | Elapsed time from case assignment to independently confirmed cause | Median plus range, case count, and unresolved cases; separate active work from waiting time |
| Missed-regression rate | Independently confirmed regressions not flagged / all independently seeded or observed confirmed regressions | Report by failure class and assistant; zero in a small sample is not universal detection |
| False-block rate | Adjudicated acceptable releases receiving BLOCK / all adjudicated acceptable releases | Requires independent release-level ground truth; not equivalent to false findings / all findings |
| Decision agreement | Guardian recommendation agrees with independent disposition / all adjudicated decisions | Report confusion table and disagreements; INCOMPLETE is separate, not PASS |
| Evaluation coverage | Completed, reviewed candidate evaluations / all eligible candidate releases in the period | Define eligibility in advance; report per assistant and missing runs |
| Second-assistant setup effort | Active setup hours until first reproducible reviewed run | Separate reusable work from assistant-specific labeling; compare complexity before claiming savings |
| Reviewer burden | Active review minutes / evaluated release | Include false alarms and disputed labels |
| Evaluation cost | Measured provider and compute charges / completed run | Show failed-run charges separately; no inferred savings from demo timing |
| Evaluation duration | End-to-end elapsed time from run start to report | Distinct from the demo's local retrieval p95 |
| Appropriate abstention | Correct abstentions / all abstentions; also report abstention recall on truly unanswerable cases | Human-reviewed answerability; avoid rewarding an assistant that refuses everything |

## Current measurements

The demo reports phrase/source correctness, all-check pass count, critical-case count, segment case counts, and local retrieval p95. Correctness is 10/16 baseline, 12/16 faulty candidate, and 16/16 repaired candidate. Critical cases can have multiple findings; do not sum findings and label them unique cases. There are no real usage, cost, or business-impact data.

## Experiment E-01 · Does the evidence workflow improve diagnosis?

**Hypothesis:** practitioners identify the true cause more quickly with Guardian evidence, without reduced decision accuracy.

**Design:** use matched but distinct failure scenarios across two assistants. Counterbalance the order of current workflow and Guardian to reduce learning effects. Hold question difficulty and evidence availability as comparable as possible. Independently label causes before sessions; do not teach the answer through the task wording.

**Suggested formative sample:** five practitioners, each attempting four matched tasks. This is a usability study, not a powered estimate of enterprise-wide impact. Record task order, role experience, assistance, completion, diagnosis accuracy, confidence, and elapsed time. A larger validation study depends on observed variation.

**Decision:** proceed if users can explain the evidence unaided and the proposed workflow addresses a recurring problem. Set quantitative continuation thresholds after baseline collection but before examining experiment results. Do not choose a favorable threshold retrospectively.

## Experiment E-02 · Does shared evaluation help the second assistant?

**Hypothesis:** common policy and report structure reduce duplicated setup while preserving local rules and source boundaries.

**Design:** onboard two actual non-production assistants with the same platform team. Record effort by integration, manifest preparation, labeling, policy configuration, and review. Document every reused artifact and each assistant-specific exception. Validate deliberate cross-assistant ID mismatches and separate pass/block outcomes.

**Decision:** if most work remains custom or owners cannot interpret shared rules, revisit the platform abstraction before adding more connectors. Do not attribute lower second-assistant effort to reuse without accounting for simpler data or prior learning.

## Proposed event dictionary

| Event | Minimal fields | Purpose |
| --- | --- | --- |
| evaluation_started/completed/failed | run ID, assistant ID, versions, timestamp, completion status | Coverage and duration |
| finding_reviewed | run ID, finding ID, classification, reviewer reference, timestamp | Adjudication and burden |
| release_disposition_recorded | assistant/run ID, proposed and human decisions, reason code, timestamp | Decision agreement |
| assistant_onboarding_recorded | assistant ID, phase, active minutes, reused artifact references | Reuse and setup effort |

Do not place raw questions, answers, source text, or personal identities in general analytics. These events are a proposed specification, not implemented tracking. Restricted evidence records can reference approved content separately.

## Readout standard

State hypothesis, sample, recruitment, assistant/task selection, baseline, denominators, results, unresolved cases, and limitations. Report counts alongside percentages. Separate observed results from interpretation and next decisions. No annualized savings or causal claims without an appropriate design and measured inputs.
