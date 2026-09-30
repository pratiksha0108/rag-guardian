# Portfolio evidence plan

The existing portfolio will be updated later. This repository preserves the material needed for an honest case study.

The [product operating pack](START-HERE.md) is a planning artifact for AI platform teams managing multiple assistants. Its use cases and SOPs demonstrate product reasoning; they do not establish customer validation or implemented multi-assistant functionality.

## Proposed narrative

1. Problem: an improved average can conceal a high-impact regression.
2. User: the person accountable for the release decision.
3. Product decision: separate hard policy checks from an adjustable quality floor.
4. Demonstration: baseline → faulty candidate → inspected evidence → repaired candidate.
5. Validation: distinguish synthetic test results from future practitioner feedback.
6. Tradeoffs: deterministic evaluation, simple retrieval, limited corpus, and why each choice was made.
7. Next experiment: independent benchmark plus one actual release workflow.

## Evidence to collect

- A short recorded demo using the shipped prototype
- Interview notes with consent and anonymization
- Before/after workflow timings from a pilot
- A benchmark version, sample size, and scoring definition with every metric
- Decisions changed by user feedback
- A failure the system missed, and the resulting product change
- Why the product direction expanded from one assistant's release report to shared platform evaluation, and what research supports or challenges that choice
- Evidence of second-assistant reuse and verified source separation before claiming platform value

## Claims allowed today

Built a local release-evaluation prototype with deterministic retrieval, a 16-case synthetic fixture, evidence inspection, critical-rule blocking, trace import/export, and automated tests. The authored candidate improves correctness while introducing four critical failures; the configured checks block it.

## Claims not supported today

Customer adoption, production accuracy, security certification, revenue, cost savings, broad regression recall, or validated market demand. Earlier example resume numbers from ideation are hypothetical and must not be reused as achievements.
