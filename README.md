# RAG Guardian

**Evidence-driven release decisions for RAG applications.**

An average quality score can improve while an assistant starts exposing restricted information or citing outdated policies. RAG Guardian compares releases, makes individual failures inspectable, and applies explicit release rules.

## Run locally

Requires Node.js 22 or newer. No dependencies, API keys, or paid services.

```sh
npm start
```

Open http://127.0.0.1:4317. Run `npm test` to verify the evaluation and server behavior.

## The three-minute demo

1. Open **Release overview**. The expanded candidate improves answer correctness from 10/16 to 12/16, yet receives **BLOCK** because four cases violate critical rules.
2. Inspect a leave question: the candidate retrieved an archived policy. Inspect an employee compensation question: restricted manager evidence was exposed.
3. Click **Apply retrieval fixes & rerun**. This restores role and current-document filters; the same 16 questions pass.
4. Open **Evaluation lab**, adjust the correctness floor, compare releases, search cases, and export a JSON evidence report.

These are reproducible synthetic results, not customer outcomes. The displayed percentages are rounded. The repaired fixture was designed alongside the implementation and is not a held-out benchmark.

## Implemented

- A real, deterministic lexical retriever over eight fictional policy documents
- Extractive answers and abstention; no LLM generation in this milestone
- Three executable pipeline configurations: baseline, intentionally faulty candidate, repaired candidate
- Separate answer correctness, access, freshness, and citation checks
- Segment-level case results, evidence inspection, and remediation suggestions
- Configurable correctness floor; critical violations always block
- JSON trace import against the demo corpus and report export
- CLI gate with exit codes: PASS = 0; BLOCK/REVIEW = 1; invalid configuration = 2
- A responsive local dashboard and automated verification workflow

```sh
node src/cli.js candidate  # intentionally exits 1
node src/cli.js repaired   # exits 0
```

## Honest boundaries

This is an MVP evaluation harness, not a production security boundary or a complete RAG orchestration platform. Lexical matching and expected-phrase checks are deliberately simple and can miss semantic errors. Permission checks depend on supplied roles and metadata; source text and access are not independently authenticated. The demo returns whole documents, has no embeddings, persistent database, login, PDF ingestion, LLM judge, or automatic deployment integration. Reports stay in memory until exported. Local latency excludes any LLM call and is not a production performance benchmark. We do not claim model groundedness, cost savings, customers, or validated market demand.

## Architecture

`Browser → local HTTP API → retrieval profiles → trace checks → release policy → evidence report`

- `src/data.js`: corpus, expected answers, roles, and pipeline profiles
- `src/engine.js`: retrieval, evaluation, import validation, aggregation
- `src/server.js`: loopback-only server, bounded imports, static asset allowlist
- `src/cli.js`: automation entry point
- `public/`: browser interface
- `tests/`: release policy, regression, import, and HTTP tests

## Product work

- [Product brief and scope](docs/product-brief.md)
- [Evaluation contract and limitations](docs/evaluation.md)
- [Trace import format](docs/trace-format.md)
- [Discovery guide and decision log](docs/discovery.md)
- [Portfolio evidence plan](docs/portfolio-plan.md)

Next milestone: validate the release decision workflow with practitioners, then connect a real RAG pipeline and an independently reviewed benchmark. Public hosting and the existing portfolio page are future work.
