---
title: Parse Primary Key ⭐️
sidebar_custom_props:
  sidebarActionType: util
---

# PrimaryKeyParser ⭐️

Parses a [Primary Key](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey) for the provided `Table`.

Given an input of any type, validates that it respects the primary key schema of the `Table` and throws an error otherwise. The input is not muted. Additional fields are silently omitted.

:::info

Only the presence and types of the primary key components are validated. Since the primary key schema of a `Table` is not technically an instance of [`Schema`](../../../4-schemas/1-usage/index.md), no `default`, `link`, or `transform` is applied.

:::

## Usage

```ts
import { PrimaryKeyParser } from 'dynamodb-toolbox/table/actions/parsePrimaryKey'

const primaryKeyParser = PokeTable.build(PrimaryKeyParser)

const primaryKey = primaryKeyParser.parse({
  partitionKey: 'pikachu',
  sortKey: 42,
  foo: 'bar'
})
// ✅ => { partitionKey: 'pikachu', sortKey: 42 }

primaryKeyParser.parse({ invalid: 'input' })
// ❌ Throws an 'actions.parsePrimaryKey.invalidKeyPart' error
```

## Output

The output is typed as the primary key of the table.

You can use the `PrimaryKey` type to explicitely type an object as a primary key:

```tsx
import type { PrimaryKey } from 'dynamodb-toolbox/table/actions/parsePrimaryKey'

type PokeKey = PrimaryKey<typeof PokeTable>
// => { partitionKey: string, level: number }
```
