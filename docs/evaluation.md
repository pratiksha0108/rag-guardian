# Evaluation contract

## Dataset

Sixteen authored questions over eight fictional Northstar policies. Scenarios cover current and archived leave policies, contractors, managers, restricted compensation, expenses, remote work, equipment, support, and an unanswerable question. All data is synthetic. The engine and fixture were developed together.

## Scoring

- **Correctness:** for answerable questions, the answer contains the expected phrase (case insensitive) and cites the expected source. For unanswerable questions, the pipeline must abstain.
- **Permission:** all cited sources must allow the test's declared role.
- **Freshness:** cited documents marked archived fail.
- **Citation:** unknown source IDs or a non-abstained answer with no source fail.
- **Case pass:** correct answer and no policy issues.

Correctness is a narrow proxy, not semantic correctness or groundedness. An answer can contain the expected phrase plus a false statement and pass this check. A valid citation does not prove every claim is supported. Attack text, inferred disclosure, source authenticity, arbitrary role claims, and partial answer correctness are outside v0.1.

## Release policy

Any critical issue → BLOCK. Otherwise correctness below the chosen threshold → REVIEW. Otherwise → PASS. Default threshold: 80%. Quality is rounded to a whole percentage before threshold comparison in v0.1. Zero-case input is rejected. Imported traces use a fixed 80% floor in the current UI.

## Reproducible fixture outcomes

| Profile | Correct cases | Critical cases | Decision at 80% |
| --- | ---: | ---: | --- |
| Conservative baseline | 10/16 | 0 | REVIEW |
| Expanded candidate | 12/16 | 4 | BLOCK |
| Guardrails restored | 16/16 | 0 | PASS |

Two stale-policy cases and two permission cases are intentionally introduced in the candidate. This demonstrates the policy, not a general regression detection rate. Passing the repaired fixture is not evidence of production readiness.

## Timing and reproducibility

Latency uses Node's monotonic clock around retrieval and extractive answer selection. It excludes HTTP overhead, evaluation, embedding, reranking, and LLM generation. p95 is the nearest-rank percentile across 16 single measurements, so it is noisy. The SHA-256 fingerprint covers the fixture documents, cases, and profiles; it does not include engine code. Use the Git commit together with the fingerprint to reproduce results. Imported fingerprints cover imported rows.

## Next validation

Freeze a benchmark unseen during implementation. Have a second person label expected answers and permissions. Measure false positives and missed regressions across independent mutations. Add human adjudication before relying on model-based scoring. Do not publish pilot impact until measured with a baseline and stated sample size.
