# Review session 01 · Pratiksha + RAG Guardian

Status: ready to begin; no human judgments have been recorded by the agent. This is collaborative product testing, not external customer discovery or independent validation.

## Start in the browser

1. Start the app with `npm start` and open http://127.0.0.1:4317/datasets.
2. Select **Salesforce support** for the easiest first session. These are fictional company rules, so you only need to check the displayed evidence, not know Salesforce administration.
3. Click **Run development tests**. A REVIEW recommendation is expected because the labels are still drafts.
4. Review SUP-01 through SUP-05. For each, inspect the reference answer, role, source, and actual retrieved excerpt.
5. Choose **Expected answer looks correct**, **Needs a correction**, or **I am unsure**, and add a short note. Save each review.
6. Click **Export my review**. Share the JSON file in chat, or tell me the case IDs and your comments. Notes remain local until you choose to share them.

## The four questions to ask for every case

- Is the user question clear and plausible?
- Does the draft answer follow from the source, without adding unsupported information?
- Is that source appropriate for the selected role and current policy version?
- Does the pipeline's actual excerpt answer the question, or merely contain similar words?

For SUP-05, the agent role cannot access the fictional admin-only export procedure. A correct expected outcome is an abstention. The review screen may show the broader synthetic inventory because the lab is a testing tool, not an authenticated employee assistant.

## Optional developer session

Switch to **Salesforce developer** and review DEV-01 through DEV-05. Open the pinned source links if useful. The first two cases currently retrieve the HTML instead of the JavaScript that contains the answer. A valid reference answer and a failing pipeline can both be true; do not change the label just to make the test pass.

If the code is unfamiliar, select **I am unsure**. I can explain the example, but our joint interpretation still does not substitute for independent expert validation.

## What we do with your feedback

I will summarize accepted labels, proposed corrections, and unresolved questions. Corrections require a new benchmark version; the original record stays traceable. We then select one pipeline improvement, predict its effect, and compare it on the development set. Reserved questions remain outside this routine loop.

## Session outcome template

- Cases reviewed:
- Questions that felt unrealistic:
- Labels needing correction:
- Sources or permission rules that were unclear:
- UI step that caused confusion:
- One next product or retrieval change to test:

No answers to these fields have been assumed.
