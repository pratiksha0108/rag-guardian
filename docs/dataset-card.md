# Dataset card · Salesforce learning lab v0.1

Prepared September 30, 2026. Status: **draft labels awaiting user review**. No Salesforce account, paid model API, or customer data is used. RAG Guardian is an independent project and is not affiliated with or endorsed by Salesforce.

## Where the data comes from

| Assistant | Source | Size | Intended use |
| --- | --- | --- | --- |
| Salesforce developer (`salesforce-lwc`) | Selected Salesforce Developers LWC Recipes repository files | 14 content files grouped into 8 documents, plus license | Retrieve evidence about selected LWC examples and setup |
| Salesforce support (`salesforce-support`) | Fictional Northstar procedures authored for this project | 6 documents, including an archived policy and an admin-only procedure | Test role filters, version filters, and abstention |
| Original Northstar release demo | Existing authored employee-policy fixture | 8 documents / 16 cases | Regression demonstration; unchanged and separate from these datasets |

Public source repository: [trailheadapps/lwc-recipes](https://github.com/trailheadapps/lwc-recipes). Frozen revision: [`7524748ece585fc08413b3fcfb2e5494e24f29ed`](https://github.com/trailheadapps/lwc-recipes/tree/7524748ece585fc08413b3fcfb2e5494e24f29ed). The [repository license at that revision](https://github.com/trailheadapps/lwc-recipes/blob/7524748ece585fc08413b3fcfb2e5494e24f29ed/LICENSE.md) identifies CC0 1.0 Universal. Its unmodified text is retained in the snapshot. No Salesforce logos or customer records are imported.

The source corpus contains `apexImperativeMethod`, `apexWireMethodWithParams`, `ldsCreateRecord`, `wireGetRecord`, `navToRecord`, and `miscToastNotification` (JavaScript and HTML), the main README, and the `pubsub` retirement note. Referenced dependencies and linked pages are not included. This is a sample-code corpus, not the entire Salesforce documentation or a general Salesforce expertise benchmark. No source code is executed and no instructions in the source README are run.

## Provenance and reproducibility

- [Snapshot manifest](../datasets/salesforce-lwc/manifest.json): upstream commit, acquisition timestamp, each original path, pinned URL, byte count, and SHA-256.
- [Raw source files](../datasets/salesforce-lwc/raw): unmodified upstream content. Files are integrity-checked before dataset loading.
- [Snapshot script](../scripts/snapshot-salesforce.js): explicitly downloads only the 15 allowlisted files at the fixed commit; checks an existing snapshot's hashes before writing.
- [Fictional corpus](../datasets/salesforce-support/corpus.json): explicit `synthetic` provenance and separate assistant IDs.

Normal use and tests are offline after checkout. `npm run snapshot:salesforce` needs network access but not a key; it is only for restoring/verifying the pinned snapshot, not updating to latest. A source update requires a new revision, manifest, benchmark review, and comparison record. The `current` flag for public examples means selected in this snapshot, not guaranteed current platform guidance.

Development reports include the dataset fingerprint, retrieval version/settings, a hash of the retrieval/loader/evaluator source, and an experiment fingerprint. The fingerprint identifies the configuration and inputs, not a unique execution; preserve the report timestamp and repository revision alongside it.

## Benchmark construction

| Assistant | Development questions | Reserved questions | Human-reviewed labels at creation |
| --- | ---: | ---: | ---: |
| Salesforce developer | 10 | 4 | 0 |
| Salesforce support | 8 | 2 | 0 |

Questions, reference answers, expected phrases, role expectations, and split assignments are AI-assisted drafts. They are not official Salesforce questions or independently validated ground truth. Many development questions explicitly name a component; this makes retrieval easier than unconstrained user questions and must be disclosed with results.

Reserved cases use expected source groups distinct from development cases. The underlying documents remain in the retrieval corpus, as knowledge sources should. Reserved questions are excluded from the web API and the development CLI. Structural validation checks their IDs and evidence existence, but their retrieval performance has not been executed during this milestone.

These are **reserved**, not a blind independent holdout: the same assistant authored them, their files are public, and source-group separation alone does not prevent all leakage. Before making a validation claim, freeze the implementation and have a human reviewer supply new questions without tuning against their outcomes. If reserved questions are inspected for tuning, retire that split as validation evidence and create a new one.

## Free retrieval baseline

Version `bm25-lines-v1`: split each file into 35-line windows with 5-line overlap; tokenize text and camelCase names; apply assistant, role, and active-version filters before scoring; rank with BM25 (`k1=1.2`, `b=0.75`); return one chunk with at least two matched query terms. Synthetic documents are chunked as plain text. Returned evidence is an exact source excerpt with source ID and original file line range.

There are no embeddings, generation model, external inference calls, paid API keys, or usage charges. Local compute is still used. This is the retrieval/evaluation foundation of RAG, not yet an LLM-generated answering system. The match threshold is a simple lexical rule, not calibrated confidence.

## Evaluation and initial observations

Development runs reuse the original phrase/source and policy checks. The phrase can appear in an incomplete excerpt, so passing does not establish a fully correct answer. The UI uses the words “mechanical phrase/source match.” Unreviewed dataset runs remain **REVIEW**, even when the mechanical threshold would PASS. Critical findings still BLOCK. Browser review annotations do not modify labels or automatically approve a release.

Initial development observations, before user review:

| Assistant | Mechanical passes | Failures observed | Release readiness |
| --- | ---: | --- | --- |
| Salesforce developer | 8/10 | DEV-01/02 selected component HTML instead of JavaScript containing the expected phrase | REVIEW |
| Salesforce support | 7/8 | SUP-07 returned an irrelevant in-scope sandbox excerpt instead of abstaining | REVIEW |

The support failure did **not** retrieve the other assistant's document: it was a relevance/abstention error. These scores describe drafted questions and this exact baseline; they are not production accuracy or security metrics. Results were not used to tune the baseline in this milestone.

## User review and storage

Open `/datasets`. Review the question, draft answer, expected evidence, and role. Mark accepted, needs correction, or unsure; add notes. Review annotations are stored in browser localStorage, keyed by assistant and dataset fingerprint, and can be exported as JSON. They are not synchronized, authenticated, committed, or independently verified. Clearing browser data removes them. Export before changing devices.

All example material is public or fictional. UI role selection simulates retrieval checks; the source inventory is intentionally visible. This is not a private multi-user workspace, real Salesforce permissions, or tenant security. Do not upload real customer records into this prototype.

## Next decision

Review at least five development labels together, record ambiguities, then version any corrected benchmark. Separate label corrections from retrieval changes. Only after that should we compare a retrieval improvement against this frozen baseline and plan genuinely independent validation.
