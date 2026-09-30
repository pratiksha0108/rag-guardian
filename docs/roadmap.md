# Roadmap and prioritized backlog

Status: proposed sequence based on dependencies and learning value. No delivery dates, staffing assumptions, or numerical RICE scores are invented. Reprioritize after discovery.

## Milestones

| Milestone | Intended outcome | Exit evidence |
| --- | --- | --- |
| M0 · Demonstration, implemented | Explain why a better average can still block a release | Executable single-assistant fixture, inspectable findings, export, automated tests |
| M1 · Validate the platform workflow | Understand repeated decisions across assistants | Observed workflows, identified release owners, documented unmet need or a pivot decision |
| M2 · Two-assistant shadow pilot | Evaluate approved external traces with shared rules and separate evidence | FR-06/07/08/10 plus minimal FR-11 satisfied; provenance and separation checks; manual register |
| M3 · Measure decision value | Determine whether the workflow earns continued use | Baseline vs pilot diagnosis, false blocks, missed failures, setup effort; owner decision |
| M4 · Operational integration | Put validated decisions into the team's release process | Identity, durable history, monitoring, access checks, rollback drill, and authorized gate integration |

## Backlog

| ID | Work item | Priority | Dependency / acceptance |
| --- | --- | --- | --- |
| B-01 | Interview practitioners and observe two release workflows | P0 | Research plan; record confirming and contradicting evidence |
| B-02 | Define assistant register and source/trace contract | P0 | FR-06/10; IDs, owners, scope, policy and benchmark versions explicit |
| B-03 | Build expected-case completeness validation | P0 | FR-03; missing required cases cannot produce PASS |
| B-04 | Add external manifest/trace adapter for approved non-production data | P0 | B-02; reject scope mismatches and invalid evidence |
| B-05 | Add complete run provenance and review records | P0 | FR-07; reproducible original report plus separate adjudication |
| B-06 | Assemble independent held-out benchmark for each assistant | P0 | Source access and reviewers available; FR-08 |
| B-07 | Verify evidence access and assistant separation | P0 | FR-10; negative tests and approved environment before sensitive data |
| B-08 | Run two-assistant shadow experiment | P0 | B-03 through B-07; metrics and criteria agreed before results |
| B-09 | Fleet release overview | P1 | UC-09; build after manual register proves useful |
| B-10 | Shared policy versions and impact preview | P1 | UC-10; minimal versioned records first, interactive preview after pilot need |
| B-11 | Add semantic scoring and an optional generation adapter | P1 | Failures justify it; independent calibration, model/provider choice and budget |
| B-12 | Persist run history with authenticated reviewers | P1 before live integration | FR-07/09; storage, access, retention, and recovery verified |
| B-13 | Deployment gate adapter | P2 | M3 evidence and M4 controls; must handle incomplete runs safely |
| B-14 | Portfolio case-study page | Later | Cleared evidence, reproducible demo, actual learning; existing portfolio structure reviewed |

P0 is necessary for the supervised real-data pilot, not a promise to build everything at once. P1 follows evidence or operational requirements. P2 is deferred.

## Deliberately deferred

Self-healing pipelines, many connectors, automated discovery of every knowledge conflict, autonomous rollout, and cross-organization SaaS. These increase surface area before validating the central workflow.

## Next planning decision

Use B-01 to confirm what B-02 must support. Meanwhile define the assistant/manifest contract and incomplete-run behavior using synthetic examples. That is useful independent work without assuming customer access, paid inference, or production authority.
