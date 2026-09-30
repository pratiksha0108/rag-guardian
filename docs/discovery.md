# Discovery guide and decision log

Status: planned. No interviews, design partners, or production results yet.

## Interview prompts

1. Walk me through the last incorrect answer your assistant produced. Who noticed?
2. How did you determine whether retrieval, source content, permissions, or generation caused it?
3. What changed in the release that introduced the problem?
4. What evidence did you need to approve the fix?
5. What makes your current evaluation noisy, expensive, or easy to ignore?
6. Who can block a release, and what happens when they do?
7. Show me the artifacts you used. Avoid sharing confidential customer data.

Ask about past behavior before showing the prototype. Record quotes only with permission. Separate observed facts, interpretation, and open questions.

## Usability exercise

Show the candidate run. Ask the participant to decide whether to ship and explain why. Measure time to identify the permission issue and locate its evidence. Ask what would change their decision. Compare against their existing process before claiming improvement.

## Decision log

| Decision | Rationale | Revisit when |
| --- | --- | --- |
| Release gate first | Focuses on one consequential user decision | Discovery reveals diagnosis is the primary unmet need |
| Rules before LLM judges | Makes results inspectable and reproducible | Semantic failures dominate a real benchmark |
| Expose segment results | Averages can obscure concentrated failures | Users need a different slice such as tenant or language |
| Zero tolerance on critical rules | Simple, explainable release contract | Labeled pilot data reveals false blocks |
| No automatic deployment | No actual release integration or authority model yet | Authenticated integration and approvals exist |

## Competitive research backlog

Compare established evaluation and observability products against the same release-decision workflow. Determine whether policy-driven evidence is a useful narrow feature, an integration, or an independent product. No novelty or market-gap claims have been validated yet.
