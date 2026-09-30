# Supervised pilot and launch plan

Status: draft; no customer enrolled. Target: one AI platform team managing two assistants within one organization. The current product is at the public-demo stage only.

## Pilot charter

**Purpose:** test whether shared evaluation evidence improves release diagnosis and reduces duplicated work without hiding assistant-specific risk.

**Participants:** platform lead, engineer, two assistant release owners, knowledge owner(s), independent evaluator, security reviewer as needed. Assign people explicitly; role titles alone are not operational coverage.

**Scope:** approved non-production or redacted traces, two scoped corpora, fixed benchmarks, shadow decisions. Production rollout authority remains in the customer's existing process.

**Expected outputs:** assistant register, baseline measurements, completed evaluation/decision records, false-block and missed-failure review, setup-effort breakdown, and continuation decision. No revenue or adoption claim until evidence exists.

## Readiness gates

### Gate A · Demonstration

- [x] Local synthetic fixture and inspectable evidence exist.
- [x] Automated engine/server checks exist.
- [x] Limitations and product hypotheses are documented.
- [ ] Pilot persona and problem validated through observed workflows.

### Gate B · Approved-data shadow pilot

- [ ] Two assistants and named owners selected.
- [ ] Data permission, storage, readers, retention, and deletion owner agreed.
- [ ] External trace and source manifests implemented and reviewed.
- [ ] Assistant separation and evidence access verified.
- [ ] Complete run provenance and expected-case checks available.
- [ ] Benchmarks independently reviewed; held-out set frozen.
- [ ] Baseline, cost/time budgets, error tolerances, and continuation criteria agreed before results.
- [ ] Incident contacts and exit procedure recorded.

### Gate C · Release-workflow integration

- [ ] Pilot shows a useful result with documented limitations.
- [ ] False blocks and missed regressions adjudicated, with owners accepting remaining limits.
- [ ] Authenticated review and durable history implemented.
- [ ] Incomplete-run behavior and failure recovery exercised.
- [ ] Monitoring and rollback/recovery responsibilities assigned.
- [ ] Actual deployment integration explicitly authorized and tested outside production first.

No boxes at Gates B/C are satisfied by the synthetic demo's 100% repaired score.

## Pilot sequence

1. **Scope:** observe existing workflow, assign roles, agree permitted data and success criteria.
2. **Baseline:** record existing diagnosis and review effort before training participants on the prototype.
3. **Onboard:** bring in assistant A, then B; log setup effort and reusable artifacts.
4. **Shadow:** run the same release scenarios through existing and Guardian-assisted processes; preserve independent adjudication.
5. **Readout:** assess benefit, misses, false blocks, burden, cost, and boundaries. Choose continue, narrow, change direction, or stop.

Calendar duration depends on participant availability and integration complexity. Prefer explicit exit evidence to an unsupported launch date.

## Stop or pause conditions

Unapproved data use, inability to verify assistant boundaries, missing benchmark truth, repeated unexplained decisions, or no accountable owner. Preserve permitted evidence, stop affected data intake, and resolve the issue before continuing. Product-value failure can justify a pivot rather than another feature sprint.

## Positioning hypothesis

For AI platform teams managing multiple assistants, RAG Guardian proposes a shared release-evidence workflow that keeps each assistant's sources, policies, and failures visible. Differentiation versus existing tools is unvalidated; competitive research must precede stronger claims.

## Launch assets, after validation

Public README and demo; short evidence-led walkthrough; redacted case study; methodology with denominators; integration guide; known limitations; owner/support contact; release notes. The existing portfolio page is a later, separate publishing step. Customer names, logos, quotes, and results require permission before publication.
