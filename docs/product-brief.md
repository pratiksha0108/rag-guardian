# Product brief · v0.2

Product direction updated September 29, 2026. See the [product operating pack](START-HERE.md) and [pilot PRD](prd.md) for requirements and procedures.

## User and job

Selected target: AI platform teams managing multiple assistants. Primary user: the platform engineer standardizing evaluation across assistants. Partner user: each assistant's release owner. Buyer hypothesis: head of AI platform. Job: make repeatable release decisions using shared rules while preserving assistant-specific sources, benchmarks, permissions, and thresholds.

The proposed pilot covers two assistants in one organization, in shadow mode. The existing Northstar policy assistant remains a single-assistant demonstration. No multi-assistant interface or isolation system is implemented yet.

## Problem hypothesis

Aggregate evaluation scores can obscure high-impact failures in small user segments. Connecting a bad answer to its source and release change may be slow. Platform teams may also duplicate evaluation work across assistants. These hypotheses need customer discovery; no interviews have been completed. Selecting this target is a product direction, not evidence of demand.

## Initial product promise

Give every release decision an inspectable trail: question → role → answer → source → failed rule → suggested next step.

Platform extension: reuse the evaluation contract across assistants while keeping each assistant's result and evidence separate. An aggregate improvement must never override an individual assistant's critical failure.

## Scope and acceptance criteria

The following describes implemented demo behavior; the [PRD](prd.md) distinguishes proposed pilot requirements.

1. Compare baseline and candidate on identical cases. Clearly identify fixtures and scoring method.
2. Block any critical access, freshness, or citation failure even when average quality rises.
3. Allow correctness thresholds to change REVIEW/PASS, never override critical failures.
4. Inspect each failure without reading server logs.
5. Restore retrieval guards and rerun the same cases.
6. Export evidence that can be independently inspected and imported for recalculation.

## Success measures for a pilot

- Primary: time from an incorrect answer report to a verified root cause, compared with the user's current workflow.
- Diagnostic recall: detected independently seeded regressions / all independently seeded regressions.
- False-block rate: safe releases incorrectly blocked / reviewed safe releases.
- Operational: evaluation cost and elapsed time per release, human-review burden.
- Adoption: weekly use in an actual release workflow, not just demo visits.
- Platform reuse: second-assistant setup effort and evaluation coverage per assistant, without relaxing evidence boundaries.

No numerical pilot targets are justified yet. Establish a baseline with design partners first.

## Product tradeoffs

- Deterministic fixtures before model-based judges: reproducible policy behavior at zero inference cost; weak semantic coverage.
- Hard stops for critical violations: easy to audit; requires trustworthy labels and can overblock.
- One corpus and three roles: makes the workflow testable; does not model tenant isolation or arbitrary enterprise permissions.
- Local first: no secrets or hosting required; no collaboration or persistence.

## Roadmap with evidence gates

1. Current: functional local evaluator and demo, automated tests, product decisions.
2. Discovery: five initial practitioner sessions and two observed release workflows. Revise persona and scope from evidence.
3. Integration: approved traces from two assistants in one team; source manifests, assistant boundaries, expected-case checks, and versioned benchmarks.
4. Evaluation: independent human labels, held-out tests, paired workflow experiments, and explicit error/burden measurements. Semantic scoring follows evidence of need.
5. Workflow: authenticated review, persisted run history, and customer deployment integration after pilot validation. Current repository CI tests the harness only.

Multi-assistant management, LLM generation, embeddings, arbitrary document import, self-healing, and autonomous deployment are not implemented.
