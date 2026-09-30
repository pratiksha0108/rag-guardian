# Use-case catalog

Status: proposed customer workflows mapped to the implemented v0.1 demo. Persona descriptions are hypotheses, not research findings.

## People and jobs

| Role | Job to accomplish | What they need to trust |
| --- | --- | --- |
| AI platform engineer · primary user | Standardize evaluation across several assistants and locate regressions | Reproducible cases, complete traces, and assistant boundaries |
| Assistant owner · partner user | Understand which users or answers are affected and decide whether to release | Assistant-specific evidence and explicit policy |
| Knowledge owner | Correct or retire source material | Document authority, version, and affected questions |
| Security reviewer | Assess suspected restricted-information exposure | Trusted identity, permissions, and evidence handling |
| Head of AI platform · buyer hypothesis | Decide whether shared evaluation merits team time and budget | Reuse across assistants, measured benefit, and manageable false alarms |

## UC-01 · Decide whether a retrieval change can ship

**Actor / trigger:** platform engineer changes retrieval settings or corpus coverage.

**Preconditions:** fixed baseline, candidate, benchmark, and release policy; expected answers reviewed. The demo supplies all four as fixtures.

**Flow:** select candidate → run the same questions → compare correctness and critical cases → inspect failed segments → export evidence → record human decision.

**Alternate paths:** invalid input means no decision; a critical failure means BLOCK; low correctness without critical failures means REVIEW. PASS means the configured checks passed, not that deployment has occurred.

**Acceptance:** the expanded candidate improves correctness from 10/16 to 12/16 but remains BLOCK with four critical cases. Reducing the quality floor does not override them.

**Measure / coverage:** time to an evidence-backed decision; implemented for demo profiles, manual approval record, real-pipeline comparison proposed. Links: FR-01, FR-03; [release SOP](sop-release.md).

## UC-02 · Investigate unauthorized evidence

**Actor / trigger:** engineer or security reviewer sees a permission finding.

**Preconditions:** user role and authoritative source permissions are known. The demo uses declared fixture roles; these are not authenticated identities.

**Flow:** inspect Q05 → compare employee role with manager-only source → inspect baseline abstention and candidate answer → assign an access-filter investigation → rerun after the change.

**Alternate paths:** an incorrect permission label is a benchmark issue; actual exposure in a live system invokes the incident SOP. Avoid copying restricted text into a public ticket or screenshot.

**Acceptance:** an employee's compensation query is blocked while the same authorized manager query remains answerable. The fix must preserve legitimate access.

**Measure / coverage:** adjudicated permission detections and diagnosis time; fixture check implemented, trusted identity and production incident handling proposed/manual. Links: FR-02, FR-06; [incident SOP](sop-incident.md).

## UC-03 · Retire an obsolete policy without breaking valid answers

**Actor / trigger:** knowledge owner publishes a new policy or notices archived evidence.

**Preconditions:** authoritative version and effective date are verified by the owner.

**Flow:** inspect Q01/Q02 → compare the archived 15-day policy with the current 20-day policy → mark the old version inactive in the source system → refresh the pipeline → rerun affected and full regression cases.

**Alternate paths:** two current documents disagree; do not assume the newer timestamp is authoritative. Ask the owner to resolve the conflict and record it.

**Acceptance:** repaired retrieval cites `leave-current`; contractor leave answers still use their distinct policy.

**Measure / coverage:** verified stale-source failures and repair time; archived flag checks implemented. Change detection, conflict discovery, effective-date reasoning, and reindexing are proposed. Links: FR-02, FR-06; [knowledge SOP](sop-knowledge.md).

## UC-04 · Distinguish safe abstention from missing coverage

**Actor / trigger:** support lead sees unanswered employee questions.

**Preconditions:** an owner has determined whether an authorized answer exists.

**Flow:** compare an intentionally unanswerable pet-insurance question with an expense question whose expected source is missing from the baseline index → preserve the first abstention → investigate the second as a coverage issue.

**Alternate paths:** ambiguous question requires clarification; ambiguous source truth requires label review. Neither is a reason to fabricate an answer.

**Acceptance:** Q14 abstention passes; baseline Q08 abstention fails expected coverage. Proposed future behavior must also support clarifying questions.

**Measure / coverage:** abstention precision and answerable-question coverage; demo examples implemented, semantic classification proposed. Links: FR-02, FR-04.

## UC-05 · Show the impact on a small employee group

**Actor / trigger:** support lead reviews an aggregate improvement.

**Preconditions:** meaningful segment labels and denominators accompany the results.

**Flow:** inspect segment counts → identify leave and access-control failures despite overall improvement → open a case → record affected role and source.

**Alternate paths:** a segment has too few examples for a reliable conclusion; mark insufficient evidence and expand the sample. Do not interpret 2/2 as proof of broad reliability.

**Acceptance:** each segment displays both passed and total cases. Proposed configurable per-segment floors cannot silently exclude failures from the overall report.

**Measure / coverage:** critical failures noticed by reviewers and decision accuracy; segment display implemented, segment-based release thresholds proposed. Links: FR-04, FR-08.

## UC-06 · Evaluate imported traces

**Actor / trigger:** engineer has recorded answers to the bundled policy questions.

**Preconditions:** JSON follows the schema, references demo source IDs, and contains permitted data.

**Flow:** import → validate → recalculate results rather than trust supplied scores → inspect failures → export report.

**Alternate paths:** duplicate IDs, unknown roles, malformed fields, or oversized input are rejected; unknown cited IDs produce critical findings. Imported runs have no baseline and use the default 80% floor.

**Acceptance:** changing supplied `passed` or `issues` values cannot conceal actual failures. No implied comparison between different test sets.

**Measure / coverage:** successful valid imports and time to first interpretable result; implemented against demo corpus only. Arbitrary source manifests are proposed. Links: FR-05, FR-06; [trace format](trace-format.md).

## UC-07 · Preserve a decision for another reviewer

**Actor / trigger:** release owner needs to explain or revisit a decision.

**Preconditions:** report exported before closing the session; Git revision and policy captured manually.

**Flow:** export report → fill T-01 with revision, dataset fingerprint, thresholds, findings, and owner → have reviewer reproduce → record decision and unresolved issues.

**Alternate paths:** missing provenance means the decision is incomplete; edited reports require regeneration from trusted inputs.

**Acceptance:** another person can identify exactly what was evaluated and which findings drove the recommendation.

**Measure / coverage:** reproducible decisions / reviewed decisions; export implemented, secure history and reviewer identity proposed. Links: FR-07; [templates](templates.md).

## UC-08 · Verify a repair without lowering the bar

**Actor / trigger:** engineer proposes a fix after a blocked run.

**Preconditions:** original benchmark and threshold retained; changed labels require separately documented adjudication.

**Flow:** run targeted failures → verify authorized positive controls → run full benchmark → compare old and new evidence → record outcome.

**Alternate paths:** new failures appear; keep the release blocked or under review. A threshold change is a product-policy decision, not a repair.

**Acceptance:** restored role/version filters pass the authored 16-case fixture; the original blocked report remains available through its saved export.

**Measure / coverage:** verified resolution and new regressions introduced; demo rerun implemented, durable history proposed. Links: FR-01, FR-03, FR-07.

## UC-09 · Triage release risk across multiple assistants

**Actor / trigger:** platform lead reviews concurrent releases for an IT help assistant and an engineering-docs assistant. These are proposed pilot examples, not existing integrations.

**Preconditions:** each assistant has an ID, owner, benchmark, source manifest, policy version, and latest completed run. Evidence visibility is scoped to authorized reviewers.

**Flow:** list assistants and pending releases → sort blocked/incomplete runs first → inspect each assistant's local baseline/candidate comparison → route findings to its owner → record separate decisions.

**Alternate paths:** no recent evaluation is shown as unevaluated, not green; a passing assistant cannot compensate for another assistant's critical failure. Source IDs must be namespaced, so identical IDs cannot resolve to another assistant's evidence.

**Acceptance:** one assistant can PASS while another BLOCKs; the fleet view retains both statuses. A trace with a mismatched assistant or corpus identity is rejected. Reviewers cannot see another assistant's restricted evidence by changing an ID.

**Measure / coverage:** evaluation coverage across eligible releases, time to triage, and onboarding effort for the second assistant; entirely proposed. Links: FR-10, FR-11.

## UC-10 · Apply a shared rule without erasing local requirements

**Actor / trigger:** platform lead updates a shared citation or permission policy.

**Preconditions:** versioned shared policy and explicit assistant-specific correctness thresholds; affected owners named.

**Flow:** preview which assistants are affected → evaluate the candidate policy in shadow mode → review newly blocked cases → approve the policy version → rerun affected assistants and retain the previous version.

**Alternate paths:** a policy creates false alarms; adjudicate the cases and revise the rule rather than bulk-exempting assistants. Missing policy versions prevent a comparable decision.

**Acceptance:** hard shared rules cannot be silently relaxed by an assistant's quality setting. Different correctness floors are visible in each report. Policy-change impact is measured per assistant before rollout.

**Measure / coverage:** policy reuse, false-block change, and time to assess affected assistants; entirely proposed. Links: FR-03, FR-11.

## Explicitly excluded from the first pilot

Autonomous production fixes, medical/legal advice workflows, employee eligibility decisions, broad enterprise connectors, multilingual quality claims, and a multi-organization SaaS offering. Supporting two assistants in one organization does not establish tenant isolation. Revisit exclusions only with a concrete user need and a scoped validation plan.
