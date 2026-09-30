# Customer discovery and validation plan

Status: planned; no recruitment or outreach has occurred. Target selected by product owner: AI platform teams managing multiple assistants.

## Questions that could change the product

1. Is evaluation duplicated across assistants, or already standardized adequately?
2. Who owns the release decision, and whose evidence do they trust?
3. Are diagnosis, benchmark maintenance, integration, or false alarms the largest burden?
4. Can teams supply approved traces and permission metadata without extensive new instrumentation?
5. Which shared rules are useful, and which differences make a common gate misleading?
6. Is this a standalone product opportunity or a feature/integration in their existing tooling?

## Recruitment hypothesis

Seek five initial participants across at least two teams: platform engineers operating two or more assistants, an assistant owner, and a platform lead. Include people who recently shipped or held a release, not only people interested in AI tooling. Five is a formative research plan, not a representative market sample. No incentive, spending, or external outreach is authorized by this document.

## Session guide · 40 minutes

| Time | Activity | What to capture |
| --- | --- | --- |
| 0–5 min | Explain research purpose and ask permission for notes/recording | Consent and approved handling |
| 5–15 min | Reconstruct the last actual release or incorrect-answer incident | Trigger, people, artifacts, elapsed work, outcome |
| 15–25 min | Compare how two assistants are evaluated | Shared rules, custom work, source boundaries, approval differences |
| 25–35 min | Give a neutral prototype task: decide whether the candidate should proceed | Behavior, misunderstandings, missing evidence, assistance |
| 35–40 min | Ask what would prevent adoption and who would approve a pilot | Integration constraints, buyer/user split, next evidence |

Prompts: “Show me how you made that decision.” “What happened when the evaluator disagreed with the owner?” “What was different for your second assistant?” “What would you need to verify this finding?” Avoid leading with promised savings or suggesting that the current process is broken.

## Synthesis

Use T-02 for every session. Separate observed behavior, direct quote, interpretation, and unresolved question. Group findings by workflow, not only feature request. For each proposed feature, record the observed problem and contradictory evidence. Keep participant identities and raw notes outside the public repository.

## Decision rules

- Repeated pain around diagnosis with usable traces → prioritize evidence and adjudication.
- Benchmark setup dominates effort → prioritize source/label workflow before a fleet dashboard.
- Existing tooling already satisfies the job → explore a focused integration or revise the concept.
- Permission truth cannot be supplied → do not market permission assurance; scope to checks the evidence supports.
- No owner will commit time or a permitted dataset → pause the pilot expansion and revisit the customer/problem selection.

The suggested next commitment is a supervised session with approved non-production traces from two assistants. Interest alone is not adoption or willingness to pay.

## Competitive research worksheet

Research products the participants actually use. Capture source/date, user, supported workflow, integration effort, evidence traceability, permission/freshness handling, policy reuse, limitations, and commercial model. No vendor comparison or market-gap claim has yet been researched for this pack. Complete that work before selecting a positioning claim.
