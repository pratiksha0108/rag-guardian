# Trace import

In Evaluation lab, select **Import traces**. Upload either an exported evidence report or JSON with a `rows` array. Inputs are limited to 2 MB and 1–1000 unique case IDs. The local server recalculates results; supplied scores and issues are ignored.

```json
{
  "rows": [{
    "id": "my-case-1",
    "question": "What is the meal reimbursement limit?",
    "role": "employee",
    "segment": "Expenses",
    "expectedSource": "expenses",
    "expected": "45 dollars",
    "answer": "The limit is 45 dollars per day.",
    "sourceIds": ["expenses"],
    "abstained": false,
    "latencyMs": 12.4
  }]
}
```

Roles: `employee`, `contractor`, `manager`. Sources: the IDs shown in Knowledge sources. For an unanswerable case, set `expected` and `expectedSource` to null. Abstained traces must have an empty sourceIds array. The answer string must still be non-empty, for example an abstention explanation.

This importer only supports traces against the bundled demo corpus. Arbitrary external document manifests are a future milestone. Imported roles and source metadata are not authenticated. Do not treat this as a production access-control system.

API: `POST /api/import`, JSON body as above. Imported runs use an 80% correctness floor. Reports are not persisted by the server.
