# `registry` — `Registry`

Holds the set of entities attached to a table, keyed by their entity attribute value (the `_et` tag). Lets cross-entity actions (query/scan/batch) resolve *which* entity a saved item belongs to in order to format it.

```ts
const registry = MyTable.build(Registry)
```

## Files

- `registry.ts` — `Registry` class (a `TableAction`).

Internal plumbing for multi-entity single-table design rather than a day-to-day user API.
