# `src/table` — Table definitions

A `Table` describes the physical DynamoDB table: its primary key (partition + optional sort key), secondary indexes, the `documentClient`, and `tableName`. Entities are attached to a table; table actions operate across **all** entities on the table (multi-entity reads/writes).

## Layout

```
table/
├── index.ts        # Barrel: Table, TableAction + key/index types
├── table.ts        # Table class + TableAction base class + TableSendableAction
├── decorator.ts    # @interceptable — lets spy/interceptor hook sendable actions
├── constants.ts    # internal symbols ($entities, $interceptor, $sentArgs)
├── errors.ts
├── types/          # Key, KeyType, Index (LocalIndex/GlobalIndex), TableMetadata
└── actions/        # Everything you can DO with a table (see actions/CLAUDE.md)
```

## Key classes (`table.ts`)

```ts
class Table<PARTITION_KEY, SORT_KEY, INDEXES, ENTITY_ATTRIBUTE_SAVED_AS = '_et'> { ... }

class TableAction<TABLE extends Table, ENTITIES extends Entity[] = Entity[]> {
  static actionName: string
  [$entities]: ENTITIES
  constructor(readonly table: TABLE, entities = [])
}
```

- `TableAction` carries the table **and** the list of entities it spans (batch/query/scan need every entity to format results). Bound via `table.build(ActionClass)`.
- `TableSendableAction` — actions that hit DynamoDB expose `.send()` (via `$sentArgs`), wrapped by the `@interceptable` decorator so `spy` can intercept.
- `ENTITY_ATTRIBUTE_SAVED_AS` — the internal attribute (default `_et`) tagging which entity a saved item belongs to.

## Indexes

`actions/indexes.ts` types GSIs/LSIs (`IndexNames`, `IndexSchema`); `types/` defines `Index`, `LocalIndex`, `GlobalIndex`, `Key`.

Conventions match the rest of the repo — see the root `CLAUDE.md`.
