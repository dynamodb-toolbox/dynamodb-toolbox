---
title: Parse 👷
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Parse 👷

Parses an [Item](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.TablesItemsAttributes) for the provided `Entity`.

Given an input of any type, validates that it respects the schema of the `Entity` and throws an error otherwise (based on the [Schema parser](../../../4-schemas/14-actions/1-parse.md) errors). Fills with defaults and links, and apply final transformation (i.e. `savedAs` and primitive `transforms`).

By default, the parsing is for `put` operation, but it can be switched to `update` or `key`.

The input is not muted. Additional fields are silently omitted.

For more details on parsing, see the [Schema parser](../../../4-schemas/14-actions/1-parse.md). Errors are the same.

## Usage

```ts
import { EntityParser } from 'dynamodb-toolbox/entity/actions/parse'

const parser = PokemonEntity.build(EntityParser)

const { item: pikachu, key: pikachuKey } = parser.parse(
  pikachuInput
)

parser.parse({ invalid: 'input' })
// ❌ Throws an 'actions.parsePrimaryKey.invalidKeyPart' error
```

## Typed Parser

By default, the parser input is typed as `unknown`. If you prefer, you can use the `EntityTParser` action. The API is strictly the same but inputs are hardly typed.

```ts
import { EntityOverParser } from 'dynamodb-toolbox/entity/actions/parse'

const tParser = PokemonEntity.build(EntityTParser)

// ❌ Additionally throws a type error
tParser.parse({ invalid: 'input' })
```

## Output

The output is typed as the primary key of the table.

You can use the `PrimaryKey` type to explicitely type an object as a primary key:

```ts
import type { PrimaryKey } from 'dynamodb-toolbox/table/actions/parsePrimaryKey'

type PokeKey = PrimaryKey<typeof PokeTable>
// => { partitionKey: string, level: number }
```
