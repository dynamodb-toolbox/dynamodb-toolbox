---
title: Parse
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# EntityParser

Given an input of any type and a mode, validates that it respects the schema of the `Entity` and applies transformations:

```ts
import { EntityParser } from 'dynamodb-toolbox/entity/actions/parse'

const {
  // 👇 Parsed item + Primary key
  item,
  key
} = PokemonEntity.build(EntityParser).parse(input)
```

The default mode is `put`, but you can switch it to `update` or `key` if needed:

```ts
const parsed = PokemonEntity.build(EntityParser).parse(
  keyInput,
  // Additional options
  { mode: 'key' }
)
```

:::info

This action is mostly a **wrapper around the [`SchemaParser`](../../../4-schemas/14-actions/1-parse.md) action**, so we highly recommend you read its dedicated documentation first.

:::

Note that:

- Additional fields are omitted, but inputs are not mutated
- The mode `defaults` and `links` are applied
- Transformations (i.e. `savedAs` and `transforms`) are applied

The `Table` primary key is derived from the validated input by applying [`computeKey`](../../1-usage/index.md#computekey) if it exists, or extracted from the transformed input otherwise.

## Methods

### `parse(...)`

<p style={{ marginTop: '-15px' }}><i><code>(input: unknown, options?: ParsingOptions) => ParsingOutput&lt;ENTITY&gt;</code></i></p>

Parses an input of any type:

<!-- prettier-ignore -->
```ts
const parsed = PokemonEntity.build(EntityParser).parse(input)
```

You can provide **parsing options** as a second argument. Available options:

| Option           |              Type              | Default | Description                                                                                                                        |
| ---------------- | :----------------------------: | :-----: | ---------------------------------------------------------------------------------------------------------------------------------- |
| `mode`           | `put`, `key` or `update` | `put` | The mode of the parsing: Impacts which `default` and `link` should be used, as well as requiredness during validation.             |
| `parseExtension` |          _(internal)_          |    -    | Dependency injection required to parse extended syntax (`$get`, `$add` etc.) when using the `update` mode (check example below). |

:::noteExamples

<Tabs>
<TabItem value="put" label="Put">

<!-- prettier-ignore -->
```ts
const pokemon = {
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  types: ['Electric'],
  ...
}

const parsed = PokemonEntity.build(EntityParser).parse(pokemon)
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const { key } = PokemonEntity.build(EntityParser).parse(
  { pokemonId: 'pikachu1' },
  { mode: 'key' }
)
```

</TabItem>
<TabItem value="update" label="Update">

```ts
const { item } = PokemonEntity.build(EntityParser).parse(
  { pokemonId: 'bulbasaur1', customName: 'PlantyDino' },
  { mode: 'update' }
)
```

</TabItem>
<TabItem value="update-extended" label="Update (extended)">

```ts
import {
  $add,
  parseUpdateExtension
} from 'dynamodb-toolbox/entity/actions/update'

const { item } = PokemonEntity.build(EntityParser).parse(
  // 👇 `$add` is an extension, so `parseExtension`  is needed
  { pokemonId: 'pikachu1', customName: $add(1) },
  { mode: 'update', parseExtension: parseUpdateExtension }
)
```

</TabItem>
</Tabs>

:::

You can use the `ParsedItem` type to explicitly type an object as a parsing output object:

```ts
import type { ParsedItem } from 'dynamodb-toolbox/entity/actions/parse'

const parsedItem: ParsedItem<
  typeof PokemonEntity,
  // 👇 Optional options
  { mode: 'key' }
  // ❌ Throws a type error
> = { invalid: 'input' }
```

Note that the `SavedItem` type is actually based on it:

```ts
import type { SavedItem } from 'dynamodb-toolbox/entity/actions/parse'

const savedItem: SavedItem<typeof PokemonEntity> = {
  pokemonId: '123'
  ...
}
```

### `reparse(...)`

<p style={{ marginTop: '-15px' }}><i><code>(input: ParserInput&lt;ENTITY&gt;, options?: ParsingOptions) => ParsingOutput&lt;ENTITY&gt;</code></i></p>

Similar to [`.parse`](#parse), but with the input correctly typed (taking the mode into account) instead of `unknown`:

```ts
PokemonEntity.build(EntityParser)
  // ❌ Throws a type error
  .reparse({ invalid: 'input' })
```

You can use the `EntityParserInput` type to explicitly type an object as a parsing input object:

```ts
import type { EntityParserInput } from 'dynamodb-toolbox/entity/actions/parse'

const input: EntityParserInput<
  typeof PokemonEntity,
  // 👇 Optional options
  { mode: 'key' }
  // ❌ Throws a type error
> = { invalid: 'input' }
```

Note that the `KeyInput` type is actually based on it:

```ts
import type { KeyInput } from 'dynamodb-toolbox/entity/actions/parse'

const keyInput: KeyInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}
```
