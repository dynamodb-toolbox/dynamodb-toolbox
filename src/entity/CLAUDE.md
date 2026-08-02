# `src/entity` — Entity definitions

An `Entity` binds an `item()` **schema** to a `Table`, giving a typed shape for a family of items living in that table. It's the primary surface users interact with: all single-item reads/writes, transactions, and per-entity batch requests are entity actions.

## Layout

```
entity/
├── index.ts        # Barrel: Entity, EntityAction + item-shape / options types
├── entity.ts       # Entity class + EntityAction base + EntitySendableAction
├── decorator.ts    # @interceptable — routes sendable actions through spy/interceptor
├── constants.ts    # internal symbols ($interceptor, $sentArgs, ...)
├── errors.ts
├── types/          # Item shapes: InputItem, ValidItem, TransformedItem, SavedItem,
│                   #   DecodedItem, FormattedItem, KeyInputItem, + option types
├── utils/          # buildEntitySchema, timestamps, entity-attribute, key validation
└── actions/        # Everything you can DO with an entity (see actions/CLAUDE.md)
```

## Key classes (`entity.ts`)

```ts
class Entity<NAME, TABLE, ATTRIBUTES, ...> {
  readonly type = 'entity'
  readonly table: TABLE
  readonly schema: BuildEntitySchema<...>   // item schema + injected key/internal attrs
  readonly entityAttribute; readonly timestamps; computeKey?
}

class EntityAction<ENTITY extends Entity = Entity> {
  static actionName: string
  constructor(readonly entity: ENTITY) {}
}
```

- `entity.build(ActionClass)` constructs an action. Actions that hit DynamoDB implement `EntitySendableAction` (`.send()` via `$sentArgs`), wrapped by `@interceptable` so `spy` can intercept.
- `buildEntitySchema` (`utils/`) augments the user schema with **internal attributes**: the entity-attribute tag (`_et`), timestamps (`created` / `modified`), and the table's key attributes — validated against the table schema (`doesSchemaValidateTableSchema`).

## Item-shape types (`types/`)

Mirror the schema value lifecycle, at item granularity: `InputItem → ValidItem → TransformedItem → EncodedItem` (write) and `EncodedItem → DecodedItem → FormattedItem` (read). `KeyInputItem` is the subset needed to address an item.

See the root `CLAUDE.md` for repo-wide conventions.
