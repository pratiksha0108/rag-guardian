# SOP-03 · Maintain sources and evaluation benchmarks

Owner roles: knowledge owner for source truth; evaluation lead for test validity. Status: proposed real-data workflow; fixture edits and manual reviews are possible today.

**Triggers:** new assistant, new source, policy/version change, access change, missed failure, or disputed label. **Outputs:** approved source manifest, versioned benchmark, review record, and rerun evidence.

## Source procedure

1. Register assistant ID, source ID, owner, purpose, version, effective period, current/archive state, access classification, and approved storage location.
2. Verify authority with the owner. A recent timestamp alone does not establish the correct policy. Record conflicts explicitly and hold affected cases for adjudication.
3. Confirm permitted use and reviewer access before importing. The current application has no authentication; use synthetic/redacted inputs or an independently access-controlled environment until that requirement is met.
4. Scope source IDs to the assistant. Proposed external manifests must reject accidental cross-assistant references. Do not share corpora merely because the same team operates both assistants.
5. Change the source in its owning system, retain a version record, and refresh the consuming pipeline. Reindexing is external to Guardian today.
6. Rerun affected questions and the full agreed regression set. Record source and benchmark changes separately so an apparent improvement is not caused by easier labels.

## Benchmark procedure

1. Sample actual work with permission: common queries, rarer high-impact queries, authorized and unauthorized counterparts, unanswerable inputs, and ambiguous questions. Record sampling method and intended population.
2. Separate development cases from a held-out validation set. Keep question paraphrases and closely related source examples in the same split where practical to reduce leakage.
3. Have a domain reviewer label expected evidence and acceptable behavior. Record who labeled it and why. Independently review high-impact cases; adjudicate disagreements instead of silently choosing a convenient answer.
4. Tag assistant, role, scenario, answerability, source version, and risk class. The current import schema supports only a subset; record extra metadata outside it until the proposed manifest is built.
5. Freeze benchmark version before comparing candidates. Do not retune against the held-out set repeatedly; if it becomes a development set, replace it and disclose the change.
6. Record every added, retired, or corrected case. Preserve the previous version and rerun baseline/candidate when a label change affects comparability.
7. Audit representation and unresolved labels at each pilot review. Case counts are not evidence of coverage unless tied to the intended population.

## Data handling rules for this project

Only fictional or explicitly cleared material belongs in the public GitHub repository. Keep participant notes, customer traces, and permission maps in an approved restricted location. Agree collection purpose, approved readers, retention duration, deletion owner, and any external model routing before intake. No universal retention period is assumed here.

Current demo exports may contain full answer text and identifiers; review before sharing. Local operation does not automatically make a dataset safe to publish. Record deletion or withdrawal of pilot material in the restricted data inventory rather than keeping copies in public history.

## Acceptance checklist

- [ ] Named source owner and authoritative version verified.
- [ ] Assistant scope and access metadata verified.
- [ ] Collection/use/storage approved for this dataset.
- [ ] Expected answers reviewed and disagreements resolved or excluded with reasons.
- [ ] Development/held-out membership recorded.
- [ ] Benchmark and source versions distinguishable.
- [ ] Baseline and candidate rerun where comparability changed.
- [ ] Public outputs contain only cleared material.
