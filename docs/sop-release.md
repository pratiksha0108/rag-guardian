# SOP-01 · Evaluate and disposition a release

Owner role: release owner for the selected assistant. Operator: pipeline engineer. Status: usable manually for the demo; real-pipeline steps are proposed until PRD dependencies are met.

**Trigger:** a change to documents, retrieval, prompts, generation model, access mapping, or evaluation policy.

**Inputs:** assistant ID, candidate and baseline revisions, source snapshot, benchmark version, effective policy, responsible owner. **Output:** evidence report plus T-01 release decision. **Stop condition:** missing/invalid inputs, unevaluated expected cases, or unresolved critical findings.

## Procedure

1. **Identify the scope.** Record assistant and release owner. For the current demo, use `northstar-demo` in the manual record; this is not an application identity field. For the future pilot, verify all run inputs belong to the same assistant.
2. **Freeze the comparison.** Use the same benchmark, source snapshot, scoring version, and policy for baseline/candidate. Record the intended pipeline change. If the corpus itself changes, record both corpus versions and the shared test set; label this a corpus-change experiment.
3. **Check expected coverage.** Confirm all required case IDs and risk scenarios are present. Current imports validate individual rows but do not verify against an expected case manifest; this check is manual.
4. **Run evaluation.** In the demo choose a profile in Evaluation lab and select Run evaluation. The CLI supports the three fixture profiles only. Imported traces have no baseline comparison and an 80% floor; do not describe them as a paired release experiment.
5. **Check integrity before scores.** Confirm case count, run completion, dataset fingerprint, and engine Git revision. If anything is missing, record INCOMPLETE manually and stop. INCOMPLETE is a proposed application state, not a current verdict.
6. **Review critical findings first.** Inspect source identity, role, status, and answer. Classify each as confirmed issue, disputed label, or insufficient evidence. Do not clear a critical finding based only on a higher average.
7. **Review remaining performance.** Check correctness, abstention, segments, and coverage. For a real pipeline also review agreed latency/cost budgets; those measurements are not supplied by the current demo.
8. **Disposition the candidate.** Apply the table below, then record the human decision outside the application. For multiple assistants, repeat separately; the platform register shows each result.
9. **Preserve evidence.** Export the report, complete T-01, and keep it in an approved location. Reports are not automatically saved by the application. Public repository evidence must remain synthetic or cleared for publication.
10. **After a repair:** retain original evidence, rerun targeted failures and authorized positive controls, then the full unchanged benchmark. Record new failures and the new decision.

## Decision table

| Evidence | Engine output today | Manual action |
| --- | --- | --- |
| Any critical permission/freshness/citation case | BLOCK | Hold candidate; investigate; do not automatically deploy |
| No critical cases; exact correctness below floor | REVIEW | Inspect coverage and labels; owner decides next experiment |
| No critical cases; correctness meets floor | PASS | Confirm completeness and known limitations; in pilot, record shadow recommendation only |
| Missing required cases, untrusted identities, interrupted run | Not fully represented | Record INCOMPLETE; repair inputs before interpreting a score |
| Disputed expected answer | May be any output | Independent adjudication, versioned correction, rerun; retain original result |

Changing the quality floor cannot fix an access violation. Shared policy changes require an impact review for every affected assistant; local quality settings must remain visible.

## Worked demo record

Assistant: northstar-demo. Baseline: v1.0. Candidate: v1.1. Correctness: 10/16 → 12/16. Critical cases: Q01/Q02 archived sources; Q05/Q06 unauthorized sources. Engine: BLOCK. Human disposition: hold fixture candidate, restore source/role filters, rerun. Repaired v1.2: 16/16 and zero critical cases on this authored fixture. This is a demonstration record, not a customer deployment approval.

**Completion:** another reviewer can locate the exact inputs, reproduce the finding, identify the owner, and explain why the candidate was held or accepted for further testing.
