# RAG Guardian · Product operating pack

Version 0.1 · Prepared September 29, 2026 · Owner: Pratiksha Shirsat, product lead

This pack supports the next product decisions, customer conversations, and pilot. The selected target is **AI platform teams managing multiple assistants**. The proposed pilot covers two assistants within one organization, initially in shadow mode. This direction was selected by the product owner; market demand, interviews, and production adoption remain unvalidated.

## Start with these decisions

1. Which repeated release decisions across assistants are painful enough for a platform team to standardize?
2. Can an independent reviewer use our evidence to make that decision correctly?
3. Which rules should be shared, and which thresholds should differ by assistant?
4. Can a real pipeline supply trustworthy traces and source permissions?
5. What measured improvement would justify a pilot expansion?

## Document map

| Document | Decision it supports | Use it when |
| --- | --- | --- |
| [Product brief](product-brief.md) | Why this product, for whom, and why this scope? | Introducing the project |
| [Use cases](use-cases.md) | Which user workflows should we support? | Discovery and design reviews |
| [PRD](prd.md) | What must the next increment do, and how will we accept it? | Planning implementation |
| [Operating model](operating-model.md) | Who owns decisions, evidence, and exceptions? | Assigning pilot roles |
| [Release evaluation SOP](sop-release.md) | Can this candidate proceed? | Every evaluated release |
| [Incident response SOP](sop-incident.md) | How do we contain, diagnose, and verify a failure? | A suspected harmful or incorrect answer |
| [Knowledge and benchmark SOP](sop-knowledge.md) | Can we trust the sources and expected answers? | Adding or changing evaluation data |
| [Metrics and experiment plan](metrics.md) | Is the product useful and is the evidence credible? | Baseline collection and pilot readout |
| [Research plan](research-plan.md) | What do we need to learn before building more? | Recruiting and conducting research |
| [Risk register](risk-register.md) | What could invalidate the product or its decisions? | Weekly product review |
| [Roadmap and backlog](roadmap.md) | What should happen next, and why? | Sprint and milestone planning |
| [Pilot and launch plan](pilot-plan.md) | Are we ready for a supervised pilot or wider release? | Go/no-go reviews |
| [Working templates](templates.md) | How do we record decisions consistently? | Interviews, releases, incidents, experiments |
| [Portfolio plan](portfolio-plan.md) | What can we credibly publish? | Preparing the future case-study page |

Technical references: [evaluation contract](evaluation.md), [trace schema](trace-format.md), [original discovery notes](discovery.md).

## Status language

- **Implemented:** behavior present in the current repository; still subject to documented limitations.
- **Manual:** a person can perform the procedure using exported reports and these templates. There is no corresponding automated workflow.
- **Proposed:** intended future behavior or operating rule, not implemented or approved by a pilot customer.
- **Hypothesis:** a claim that needs research or experimental evidence.

The current product is a local synthetic evaluation harness. It is not connected to a production deployment system. Its PASS/BLOCK/REVIEW output is a recommendation; only the CLI exit status is machine-enforceable if someone integrates it. GitHub's project tests validate the harness and repaired fixture; they do not evaluate a customer's release.

## Suggested first working session

Read UC-01 and UC-02, replay the candidate, inspect Q05, and record a release decision using T-01. Then identify one practitioner who can critique that workflow. The next engineering milestone should follow the evidence from that conversation.

## Maintenance

Update the PRD and roadmap when scope changes. Update the evaluation contract when scoring changes. Record why in T-04. Review this pack at each milestone; proposed operating rules require named pilot owners before live use. Keep confidential research and customer traces outside this public repository.
