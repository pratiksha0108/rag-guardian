# SOP-02 · Triage an incorrect or unsafe answer

Status: proposed customer operating procedure; the product has no incident automation or production controls. Owner: the customer's designated incident owner. Use the customer's existing response policy where applicable.

**Trigger:** user report, evaluation finding, or observed unauthorized/stale/unsupported answer. **Output:** restricted incident record, verified repair, and regression case.

## Triage categories

| Category | Example | Initial handling |
| --- | --- | --- |
| Potential exposure | Employee sees manager-only evidence | Promptly notify authorized security/incident owner; contain using existing controls |
| Material answer error | Assistant cites an obsolete policy | Assess affected workflows and sources; hold related release; assign knowledge owner |
| Coverage/usability issue | Valid question unnecessarily abstains | Reproduce and prioritize with assistant owner |
| Evaluation defect | Wrong expected label or stale benchmark | Preserve report; assign independent label review |

These categories are proposed, not service-level guarantees. Severity depends on actual impact and scope, not only the evaluator's `critical` label. A synthetic archived-source finding is not automatically a live security incident.

## Procedure

1. **Record minimal evidence.** Capture time, assistant/run identifiers, reported symptom, source IDs, pipeline revision, and restricted evidence location. Avoid copying sensitive answer text into public issues.
2. **Assess immediate impact.** Determine whether the issue was a pre-release test or a live answer. Identify affected assistant, roles, document versions, and time range. Mark unknowns explicitly.
3. **Contain through authorized controls.** The incident owner decides whether to pause an assistant, revert a release, remove a source, or route users to human support. Guardian does not perform these actions. Preserve restricted evidence before changing the system when feasible.
4. **Reproduce in a controlled setting.** Use approved or redacted inputs. Record whether failure is consistent, intermittent, or not reproducible. Do not reuse customer secrets in the public demo.
5. **Locate the cause.** Inspect source authority → ingestion/parsing → role filter → retrieval/ranking → answer generation → citation mapping. The current demo exposes only selected sources and extractive answers, so conclusions about other stages need external traces.
6. **Check shared dependencies.** If a common parser, model, prompt, or access rule is implicated, identify every assistant using that version. Test each separately; do not assume either shared impact or isolation without evidence.
7. **Assign the repair.** Knowledge owner handles source corrections; engineer handles pipeline changes; evaluation lead handles labels. Document the evidence supporting the diagnosis.
8. **Verify.** Add an independently reviewed regression case; rerun the failing input, authorized positive controls, affected assistant benchmarks, and agreed broader checks. Confirm the cause is addressed rather than only the example phrasing.
9. **Resolve and learn.** Incident owner records restoration decision and communications under the customer's process. Complete T-03 with timeline, impact, root cause, verification, and prevention owner. Review whether a shared product requirement should change.

## Closure criteria

Impact assessed; source/pipeline versions known; containment and restoration owned; repair independently reviewed; regression tests recorded; affected assistants checked; follow-up owner assigned. If any remain unknown, keep the record open or explicitly document residual uncertainty.

Metric: measure detection-to-confirmed-diagnosis separately from diagnosis-to-repair. Do not report only resolved incidents and omit unresolved ones from the readout.
