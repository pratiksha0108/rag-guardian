# Product requirements · Supervised evaluation pilot

Status: draft v0.1. This PRD proposes the next increment; it does not mark the pilot ready. Product owner: Pratiksha Shirsat. Engineering, evaluation, and pilot decision owners must be assigned before execution.

## Problem and intended outcome

An AI platform team needs a consistent way to evaluate releases across assistants while preserving their different data boundaries, benchmarks, and owners. An assistant owner needs to explain failures hidden by its average score. We hypothesize that shared rules and comparable evidence will reduce duplicated evaluation work and shorten verified diagnosis without creating excessive false blocks.

Pilot scope: two assistants managed by one AI platform team, separate approved corpora and benchmarks, and a human release owner for each. Candidate examples are IT help and engineering documentation; select actual workflows through discovery. Start in shadow mode: compare Guardian recommendations with the team's existing process; do not grant deployment authority. The existing employee-policy demo remains a single-assistant fixture.

## Journey

Select assistant and owner → identify change → freeze inputs and effective policy → evaluate → inspect assistant-specific evidence → adjudicate findings → decide outside the application → verify repair → preserve evidence → update cross-assistant status.

## Functional requirements and acceptance

| ID | Requirement | Current status | Next-increment acceptance evidence |
| --- | --- | --- | --- |
| FR-01 | Compare releases on identical cases | Implemented for fixtures | Real runs have identical case IDs, benchmark version, policy, and source snapshot; mismatches prevent a comparable result |
| FR-02 | Explain correctness, access, freshness, and citation findings | Rule checks implemented; semantic support absent | Rule definition, expected/actual evidence, and affected role visible; unsupported checks explicitly marked unevaluated |
| FR-03 | Apply a deterministic release contract | Implemented | Critical findings block regardless of quality; invalid/incomplete runs cannot PASS; exact ratios determine thresholds |
| FR-04 | Inspect segments and individual traces | Implemented for fixtures | Show denominators, abstentions, source versions, and reviewer evidence; no disclosure to unauthorized reviewers |
| FR-05 | Reject malformed trace imports and recompute scores | Implemented with demo limits | Maintain schema validation and size limits; actionable errors; imported annotations cannot override computed findings |
| FR-06 | Accept an approved external corpus manifest and pipeline traces | Proposed, P0 | Manifest includes stable source IDs, authority/owner, version, effective status, and access metadata; unknown provenance yields incomplete evaluation; no external fetch by default |
| FR-07 | Preserve run provenance and adjudication | Export/manual record now; persistence proposed, P0 | Record engine revision, benchmark, source snapshot, policy, pipeline/model configuration, timestamp, reviewer, and decision; preserve original evidence separately from annotations |
| FR-08 | Calibrate labels and decision errors independently | Proposed/manual, P0 | Held-out questions and mutations reviewed independently; false blocks and missed failures reported with counts and denominators |
| FR-09 | Integrate a customer deployment gate | Proposed, deferred | Only after shadow-pilot acceptance: authenticated integration, incomplete-run failure handling, audited decisions, and exercised rollback |
| FR-10 | Preserve assistant identity and evidence boundaries | Proposed, P0 | Every run/source/benchmark is scoped to an assistant; mismatched IDs rejected; authorized review enforced before showing real restricted data; two-assistant separation tests pass |
| FR-11 | Reuse shared policy with visible local settings | Proposed, P0 minimal / P1 dashboard | Shared critical rules plus versioned assistant-specific quality floors; manual two-assistant register allowed initially; later fleet view never hides BLOCK/unevaluated behind an average |

P0 means required to begin the real-data evaluation pilot. It does not imply these features are implemented.

## Quality and data requirements

- Repeatability: deterministic rules return the same decisions for identical inputs. Stochastic model runs require configuration, repeat counts, and variation reporting.
- Data handling: use approved, redacted material in a customer-controlled location; the public repository contains only synthetic or explicitly cleared artifacts.
- Identity: declared role strings are insufficient for a real permission assurance claim. Verify identity/access mappings independently before using those findings to approve a release.
- Failure behavior: interrupted execution, missing cases, or inaccessible evidence produce an incomplete result, never a reassuring score. Current completeness checks are limited to input validation, not expected-case coverage.
- Accessibility: decision state has text, not only color; evidence is keyboard accessible; checks cover navigation, focus, and screen-reader labels before pilot expansion.
- Performance: set an evaluation-time and cost budget with the pilot owner after baseline measurement. The current local retrieval p95 is not that budget.

## Non-goals

Autonomous remediation, automated production rollout, general document-management software, replacing enterprise authorization, unrestricted document upload, and claims of universal hallucination detection.

## Dependencies and unresolved decisions

| Decision | Owner role | Needed before |
| --- | --- | --- |
| Confirm first customer workflow and decision maker | Product lead | Integration scope freeze |
| Obtain usable traces and source permissions | Pilot engineer + data owner | External import implementation |
| Choose model/provider and permitted data routing, if needed | Engineer + pilot owner | Any paid or external inference |
| Define approved retention and reviewers | Data owner | First customer dataset |
| Set quality, latency, cost, and false-block tolerances | Release owner + evaluation lead | Pilot evaluation |

## Definition of done for this increment

UC-01, UC-02, UC-06, and UC-07 can be exercised on approved non-production traces from two assistants; UC-09/10 work through a manual assistant register and explicit policy versions before a fleet dashboard is required. An independent reviewer can reproduce each result; provenance and assistant boundaries are verified; data handling is agreed; good and deliberately faulty runs are demonstrated; limitations are visible; owners accept shadow-mode use. A polished demo alone does not meet this definition.
