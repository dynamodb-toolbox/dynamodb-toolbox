# `parsePrimaryKey` — `PrimaryKeyParser`

Validates and extracts a table's primary key (`{ partitionKey, sortKey? }`) from a key input, according to the table's declared key attributes and types.

```ts
const pk = MyTable.build(PrimaryKeyParser).parse({ pk: 'USER#1', sk: 'PROFILE' })
```

## Files

- `primaryKeyParser.ts` — `PrimaryKeyParser` class (a `TableAction`); `PrimaryKey` type.
- `errors.ts` — raised on missing/mistyped key attributes.

Used internally wherever a raw key must be validated against the table shape.
