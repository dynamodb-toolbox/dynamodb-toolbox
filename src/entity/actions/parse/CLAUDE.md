# `parse` — `EntityParser`

The entity write path. Wraps the schema [`Parser`](../../../schema/actions/parse/CLAUDE.md), pre-bound to the entity's **augmented** schema (key attributes, entity tag, timestamps injected). Validates + transforms an input item and computes its primary key.

```ts
const { item, key } = User.build(EntityParser).parse(input, { mode: 'put' })
```

## Files

- `entityParser.ts` — `EntityParser` class; `ParseItemOptions`, `InferWriteItemOptions`.
- `options.ts`, `constants.ts`.

Used internally by `put` / `update` / batch / transaction write commands. `mode` (`put` | `update` | `key`) selects how strictly the item is parsed and whether update extensions are allowed.
