# Guided workflow usability update

User feedback: the dashboard had too many words and numbers, and did not explain what to do.

## Observed issues and changes

| Screen | Finding | Change |
| --- | --- | --- |
| Home | Results, percentages, thresholds and multiple navigation options compete before the task is explained. | Plain-language purpose, one primary button, support sample selected by default. |
| Results | Aggregate metrics do not make the next action obvious. | A short result and a single review action; flagged questions come first. |
| Review | Tables and source details demand too much reading at once. | One question at a time, actual vs expected response, three review choices; evidence is optional. |

Existing green/ivory styling is retained with larger text and controls. Advanced experiments and the dataset inventory remain accessible behind a disclosure. Existing browser review keys and exports are unchanged. No review was approved on the user's behalf.

Evidence: `ux-before.png` captures the old dashboard; `simple-start.png` captures the new default view. Browser verification covers running the sample, opening the first flagged question, and navigating questions. Automated tests cover the existing evaluation behavior and the guided route mappings.

Remaining validation: ask the user to try the new starting screen and explain its purpose and next action in their own words. This is an implemented usability hypothesis, not a measured improvement or user-research result.
