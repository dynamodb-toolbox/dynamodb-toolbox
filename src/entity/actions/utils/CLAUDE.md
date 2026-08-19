# `utils` — shared action helpers

Cross-action helpers that are **not** `EntityAction`s (no `entity.build(...)` surface). They
are re-exported from the root **and** from each action that uses them.

## Condition-check error formatting

When a single-item write is rejected by a `condition` with `returnValuesOnConditionFalse: 'ALL_OLD'`,
DynamoDB throws a `ConditionalCheckFailedException` carrying the offending item as raw
`AttributeValue`s (`lib-dynamodb` does **not** unmarshall thrown exceptions). These helpers
format that item into the entity's `FormattedItem` shape.

```ts
try {
  await Pokemon.build(PutItemCommand)
    .item(pokemon)
    .options({ condition: { attr: 'pk', exists: false }, returnValuesOnConditionFalse: 'ALL_OLD' })
    .send()
} catch (error) {
  // type-guard
  if (isConditionCheckFailed(error, Pokemon)) {
    error.Item // raw AttributeValues (unchanged)
    error.FormattedItem // FormattedItem<typeof Pokemon> | undefined
  }
  // ...or asserter (re-throws non-condition errors)
  assertConditionCheckFailed(error, Pokemon)
  error.FormattedItem
}
```

## Files

- `isConditionCheckFailed.ts` — type-guard; narrows a caught `unknown` to a
  `ConditionalCheckFailedException & { FormattedItem? }`. As a side-effect it **augments** the
  error in place: when the exception carries a raw `Item` and has not been augmented yet, it
  `unmarshall()`s the item and formats it via `entity.build(EntityFormatter)` — best-effort,
  wrapped in a `try/catch` that leaves `FormattedItem` `undefined` on any failure (missing
  required attrs, cross-entity item, ...). No-op when `entity` is omitted. Detects via
  `error.name` (no runtime AWS import, robust to duplicate `@aws-sdk` copies).
  `+ ConditionCheckFailedError` type.
- `assertConditionCheckFailed.ts` — assertion counterpart: **re-throws** non-condition errors,
  otherwise augments (via the guard) + narrows to `ConditionCheckFailedError<ENTITY>`. `entity`
  is optional.

Augmentation is **lazy**: the write commands leave the thrown exception untouched — the
`FormattedItem` is attached the moment the caller runs the guard / asserter in its `catch`
block (idempotent, so calling twice re-uses the first result). Both are re-exported from the
root and from each single-item action barrel (`put` / `update` / `updateAttributes` / `delete`).
