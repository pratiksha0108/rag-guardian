# Product brief · v0.1

## User and job

Initial user hypothesis: an AI platform engineer maintaining an internal support or policy assistant. Partner user: the support operations lead accountable for incorrect answers. Job: decide whether a retrieval or corpus change can ship and explain that decision to another team.

## Problem hypothesis

Aggregate evaluation scores can obscure high-impact failures in small user segments. Connecting a bad answer to its source and release change may be slow. Both hypotheses need customer discovery; no interviews have been completed.

## Initial product promise

Give every release decision an inspectable trail: question → role → answer → source → failed rule → suggested next step.

## Scope and acceptance criteria

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

No numerical pilot targets are justified yet. Establish a baseline with design partners first.

## Product tradeoffs

- Deterministic fixtures before model-based judges: reproducible policy behavior at zero inference cost; weak semantic coverage.
- Hard stops for critical violations: easy to audit; requires trustworthy labels and can overblock.
- One corpus and three roles: makes the workflow testable; does not model tenant isolation or arbitrary enterprise permissions.
- Local first: no secrets or hosting required; no collaboration or persistence.

## Roadmap with evidence gates

1. Current: functional local evaluator and demo, automated tests, product decisions.
2. Discovery: five interviews and two observed release decisions. Revise persona and scope from evidence.
3. Integration: ingest traces from one real pipeline; add document manifests and versioned benchmarks.
4. Evaluation: independent human labels, held-out tests, semantic metrics, judge calibration, attack cases.
5. Workflow: repository checks, persisted run history, authenticated users, access enforcement, deployment gate integration.

LLM generation, embeddings, arbitrary document import, self-healing, and autonomous deployment are not implemented.
