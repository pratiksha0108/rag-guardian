# Product risk register

Status: open hypotheses and known prototype limitations. Priority is qualitative judgment, not a measured probability. Review during pilot planning and after each significant incident.

| ID | Risk / observable trigger | Priority | Owner role | Response and evidence to close |
| --- | --- | --- | --- | --- |
| R-01 | Target teams already solve this workflow adequately | High | Product lead | Observe current releases and substitutes; narrow or revise scope if no material unmet job |
| R-02 | Benchmark overfitting creates impressive but non-general results | High | Evaluation lead | Independent labels and held-out mutations; report split, sample, and misses |
| R-03 | Phrase matching accepts contradictory or unsupported answers | High | Evaluation lead | Human semantic review; later calibrated semantic scorer; label current score as a proxy |
| R-04 | Declared roles or source metadata are untrustworthy | High | Security reviewer | Verify identity/access provenance; do not use current demo checks as security approval |
| R-05 | Traces from one assistant resolve against another's sources | High | Pipeline engineer | Namespaced manifests, assistant matching, evidence authorization, negative separation tests before real-data pilot |
| R-06 | Missing cases or failed runs appear safe | High | Pipeline engineer | Expected-case manifest and incomplete state; manually reject missing coverage today |
| R-07 | Public reports or analytics expose sensitive evidence | High | Knowledge owner | Approved storage and redaction; synthetic-only public examples; review report content before publication |
| R-08 | False blocks cause owners to bypass the evaluator | High | Platform lead | Independent adjudication, visible explanations, measure reviewer burden and false blocks; no silent overrides |
| R-09 | A shared policy harms assistants with different requirements | Medium | Platform lead | Versioned shared rules, explicit local thresholds, per-assistant impact review before policy changes |
| R-10 | Imported or edited report fields are mistaken for trusted ground truth | High | Evaluation lead | Recalculate scores, preserve provenance, independently verify source/label authority; current recalculation alone is insufficient |
| R-11 | Model-as-judge adds bias, variability, or cost | Medium | Evaluation lead | Human calibration, repeated runs, budget and disagreement reporting before adopting a judge |
| R-12 | Pipeline adapters consume more effort than product value | Medium | Product lead | Start with one trace contract and two assistants; measure setup effort before more connectors |
| R-13 | Local prototype mistaken for production-ready multi-assistant service | High | Product lead | Maintain feature/status inventory; launch gates require identity, history, isolation, and operational ownership |

## Escalation

Suspected exposure invokes SOP-02 and the customer's incident process. A finding that invalidates benchmark truth or assistant boundaries stops interpretation of the affected run. Product-market risks trigger a discovery decision rather than an engineering patch.

## Assumption log

- A-01: platform teams want a shared release-evidence workflow. Unvalidated.
- A-02: two assistants expose enough variation to test policy reuse. Pilot design hypothesis.
- A-03: required source/access metadata is available and permitted for evaluation. Unvalidated dependency.
- A-04: diagnosis time is valuable enough to change behavior. Unvalidated.
- A-05: a human owner can adjudicate cases independently. Must be confirmed before a pilot.

Closing an assumption requires a link to evidence and a dated decision, not merely implementation of its associated feature.
