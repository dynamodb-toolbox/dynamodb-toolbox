---
title: Format
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Formatter

Given a saved item, validates that **it respects the schema** and formats it:

```ts
import { Formatter } from 'dynamodb-toolbox/schema/actions/format'

const formattedPikachu = pokemonSchema
  .build(Formatter)
  .format(savedPikachu)
```

Note that:

- Additional and `hidden` fields are omitted, but inputs are not mutated
- The formatting will throw an error if the saved item is invalid
- Transformations (i.e. `savedAs` and `transforms`) are applied in reverse

## Methods

### `format(...)`

<p style={{ marginTop: '-15px' }}><i><code>(savedValue: unknown, options?: FormattingOptions) => FormattedValue&lt;SCHEMA&gt;</code></i></p>

Formats a saved item:

<!-- prettier-ignore -->
```ts
const formattedValue = pokemonSchema.build(Formatter).format(savedValue)
```

You can provide **formatting options** as a second argument. Available options:

| Option       |       Type       | Default | Description                                                                                                                                                                                                                |
| ------------ | :--------------: | :-----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `partial`    |    `boolean`     | `false` | Allow every attribute (root or nested) to be optional while formatting.                                                                                                                                                    |
| `attributes` | `Path<Entity>[]` |    -    | To specify a list of attributes to format (other attributes will be omitted).<br/><br/>See the [`PathParser`](../../3-entities/3-actions/18-parse-paths/index.md) action for more details on how to write attribute paths. |

:::noteExamples

<Tabs>
<TabItem value="partial" label="Partial">

```ts
const saved = {
  pokemonId: 'pikachu1',
  name: 'Pikachu'
}

// 🙌 Typed as `DeepPartial<Pokemon>`
const formatted = pokemonSchema
  .build(Formatter)
  .format(saved, { partial: true })
```

</TabItem>
<TabItem value="attributes" label="Attributes">

```ts
const saved = {
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  level: 42,
  ...
}

// 🙌 Typed as `Pick<Pokemon, 'name' | 'level'>`
const formatted = pokemonSchema.build(
  Formatter
).format(saved, { attributes: ['name', 'level'] })
```

</TabItem>
</Tabs>

:::

You can use the `FormattedValue` type to explicitly type an object as a formatting output object:

```ts
import type { FormattedValue } from 'dynamodb-toolbox/schema/actions/format'

const formattedValue: FormattedValue<
  typeof pokemonSchema,
  // 👇 Optional options
  { partial: false; attributes: 'name' | 'level' }
  // ❌ Throws a type error
> = { invalid: 'output' }
```
