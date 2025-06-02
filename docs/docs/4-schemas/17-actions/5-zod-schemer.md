---
title: ZodSchemer
sidebar_custom_props:
  sidebarActionType: util
  new: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ZodSchemer

:::note

`ZodSchemer` requires the `zod` dependency to be installed first:

```bash
npm install zod
```

:::

Transpiles DynamoDB-Toolbox schemas to [Zod Schemas](https://github.com/colinhacks/zod). Note that the **transpilation itself is type-safe**, which means that **resulting schema types can be introspected** and **type inference is preserved**:

```ts
import { ZodSchemer } from 'dynamodb-toolbox/schema/actions/zodSchemer'

const zodSchemer = pokemonSchema.build(ZodSchemer)

const zodParser = zodSchemer.parser()
const parsed = zodParser.parse(input)
// => TransformedValue<typeof pokemonSchema>

const zodFormatter = zodSchemer.formatter()
const formatted = zodFormatter.format(parsed)
// => FormattedValue<typeof pokemonSchema>
```

:::note

Because DynamoDB-Toolbox schema are more flexible than Zod Schemas ([Parsing](./1-parse.md) vs [Formatting](./2-format.md), Item vs Keys etc.), you may need to transpile **several Zod Schemas** for different contexts.

:::

## ⚠️ Known Limitations

The most important limitation at the moment is that **[`links`](../2-defaults-and-links/index.md#links) are not transpiled** (but [`defaults`](../2-defaults-and-links/index.md#defaults) are):

```ts
const nameSchema = item({
  firstName: string(),
  lastName: string()
})

const fullSchema = nameSchema.and({
  fullName: string().link<typeof nameSchema>(
    ({ firstName, lastName }) =>
      [firstName, lastName].join(' ')
  )
}))

const zodSchema = fullSchema.build(ZodSchemer).parser()
// ❌ Error: Missing `fullName` attribute
zodSchema.parse({ firstName: 'John', lastName: 'Dow' })
```

Also, `hidden` attributes are simply stripped for now (thus not validated during formatting):

```ts
const schema = map({
  hidden: string().hidden()
})

const zodSchema = schema.build(ZodSchemer).formatter()
// ⚠️ Does not throw even if `hidden` is required
zodSchema.format({})
```

Due to some discrepancies between schema systems, [discriminated unions](../16-anyOf/index.md#discriminate) also suffer from some minor limitations:

- **Discriminated AND remapped** `maps` cannot be transpiled:

```ts
const schema = anyOf(
  map({ type: string().const('a').savedAs('_t') }),
  map({ type: string().const('b').savedAs('_t') })
).discriminate('type')

const zodSchema = schema.build(ZodSchemer).parser()
// ❌ Fails: `ZodDiscriminatedUnion` does not support `ZodEffect` options
zodSchema.parse(input)
```

- **Discriminated AND refined** `maps` cannot be transpiled (should be fixed with [Zod v4](https://v4.zod.dev/v4?id=refinements-now-live-inside-schemas)):

```ts
const schema = anyOf(
  map({ type: string().const('a') }).validate(...),
  map({ type: string().const('b') }).validate(...)
).discriminate('type')

const zodSchema = schema.build(ZodSchemer).parser()
// ❌ Fails: `ZodDiscriminatedUnion` does not support `ZodEffect` options
zodSchema.parse(input)
```

- **Nested discriminated union** cannot be transpiled (should be fixed with [Zod v4](https://v4.zod.dev/v4?id=refinements-now-live-inside-schemas#upgraded-zdiscriminatedunion)):

```ts
const schema = anyOf(
  map({ type: string().const('a') }),
  anyOf(
    map({ type: string().const('b') }),
    map({ type: string().const('c') })
  )
).discriminate('type')

const zodSchema = schema.build(ZodSchemer).parser()
// ❌ Fails: `ZodDiscriminatedUnion` does not support `ZodDiscriminatedUnion` options
zodSchema.parse(input)
```

## Methods

### `parser(...)`

<p style={{ marginTop: '-15px' }}><i><code>(options?: ZodParserOptions) => ZodParser&lt;SCHEMA&gt;</code></i></p>

Creates a `zodSchema` to use for Item parsing. It includes defaults, custom validation and transformations (see the [`Parser`](./1-parse.md) action for more details on parsing):

```ts
import { z } from 'zod'

const nameSchema = item({
  firstName: string().savedAs('_f'),
  lastName: string().validate(input => input.length > 1)
})

const zodParser = nameSchema.build(ZodSchemer).parser()

// ❌ `firstName` missing
zodParser.parse({ lastName: 'Dow' })
// ❌ `lastName` too short
zodParser.parse({ firstName: 'John', lastName: '' })
// ✅  Success
zodParser.parse({ firstName: 'John', lastName: 'Dow' })

type ParsedName = z.infer<typeof zodParser>
// => { _f: string, lastName: string } 🙌
```

You can provide additional options. Available options:

| Option      |      Type      | Default | Description                                                                                                         |
| ----------- | :------------: | :-----: | ------------------------------------------------------------------------------------------------------------------- |
| `fill`      |   `boolean`    | `true`  | Whether to include `defaults` in the resulting schema or not (`links` are NOT transpiled at the moment).            |
| `transform` |   `boolean`    | `true`  | Whether to include post-validation transformations (i.e. `savedAs` and `transform`) in the resulting schema or not. |
| `mode`      | `put` or `key` |  `put`  | Wether to keep only `key` attributes in the schema or not (`update` mode is NOT supported at the moment).           |
| `defined`   |   `boolean`    | `false` | Whether to reject `undefined` values in the resulting schema or not (even if the original schema is optional).      |

:::note[Examples]

<Tabs>
<TabItem value="fill" label="Not Filled">

```ts
const schema = item({
  pokemonId: string(),
  level: number().default(1)
})

const zodSchemer = schema.build(ZodSchemer)
const zodSchema = zodSchemer.parser({ fill: false })

// ❌ `level` missing
zodSchema.parse({ pokemonId: 'pikachu1' })
```

</TabItem>
<TabItem value="transform" label="Not Transformed">

```ts
const addOne = {
  encode: (input: number) => input + 1,
  decode: (saved: number) => saved - 1
}

const schema = item({
  pokemonId: string().savedAs('id'),
  level: number().transform(addOne)
})

const zodSchemer = schema.build(ZodSchemer)
const zodSchema = zodSchemer.parser({ transform: false })

zodSchema.parse({ pokemonId: 'pikachu1', level: 1 })
// ✅ => { pokemonId: 'pikachu1', level: 1 }
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const schema = item({
  pokemonId: string().key(),
  level: number()
})

const zodSchemer = schema.build(ZodSchemer)
const zodSchema = zodSchemer.parser({ mode: 'key' })

zodSchema.parse({ pokemonId: 'pikachu1' })
// ✅ => { pokemonId: 'pikachu1' }
```

</TabItem>
<TabItem value="defined" label="Defined">

```ts
const schema = string().optional()

const zodSchemer = schema.build(ZodSchemer)
const zodSchema = zodSchemer.parser({ defined: true })

// ❌ Input is NOT optional
zodSchema.parse(undefined)
```

</TabItem>
</Tabs>

:::

### `formatter(...)`

<p style={{ marginTop: '-15px' }}><i><code>(options?: ZodFormatterOptions) => ZodFormatter&lt;SCHEMA&gt;</code></i></p>

Creates a `zodSchema` to use for Item formatting. It includes transformations, custom validation and formatting (see the [`Formatter`](./2-format.md) action for more details on formatting):

```ts
import { z } from 'zod'

const nameSchema = item({
  firstName: string().savedAs('_f'),
  lastName: string().validate(input => input.length > 1)
})

const zodFormatter = nameSchema
  .build(ZodSchemer)
  .formatter()

// ❌ `_f` missing
zodParser.parse({ lastName: 'Dow' })
// ❌ `lastName` too short
zodParser.parse({ _f: 'John', lastName: '' })
// ✅  Success
zodParser.parse({ _f: 'John', lastName: 'Dow' })

type ParsedName = z.infer<typeof zodParser>
// => { firstName: string, lastName: string } 🙌
```

You can provide additional options. Available options:

| Option      |   Type    | Default | Description                                                                                                        |
| ----------- | :-------: | :-----: | ------------------------------------------------------------------------------------------------------------------ |
| `transform` | `boolean` | `true`  | Whether to include pre-validation transformations (i.e. `savedAs` and `transform`) in the resulting schema or not. |
| `format`    | `boolean` | `true`  | Whether to strip `hidden` attributes from the resulting schema or not.                                             |
| `partial`   | `boolean` |  `put`  | Wether to make every attribute (flat or deep) `optional` in the schema or not.                                     |
| `defined`   | `boolean` | `false` | Whether to reject `undefined` values in the resulting schema or not (even if the original schema is optional).     |

:::note[Examples]

<Tabs>
<TabItem value="transform" label="Not Transformed">

```ts
const schema = item({
  pokemonId: string().savedAs('id'),
  level: number().transform(input => input + 1)
})

const zodSchemer = schema.build(ZodSchemer)
const zodSchema = zodSchemer.formatter({ transform: false })

zodSchema.parse({ pokemonId: 'pikachu1', level: 1 })
// ✅ => { pokemonId: 'pikachu1', level: 1 }
```

</TabItem>
<TabItem value="format" label="Not Formatted">

```ts
const schema = item({
  pokemonId: string(),
  createdAt: string().hidden()
})

const zodSchemer = schema.build(ZodSchemer)
const zodSchema = zodSchemer.formatter({ format: false })

// ❌ `createdAt` missing
zodSchema.parse({ pokemonId: 'pikachu1' })
```

</TabItem>
<TabItem value="partial" label="Partial">

```ts
const schema = item({
  pokemonId: string(),
  level: number()
})

const zodSchemer = schema.build(ZodSchemer)
const zodSchema = zodSchemer.formatter({ partial: true })

zodSchema.parse({})
// ✅ => {}
```

</TabItem>
<TabItem value="defined" label="Defined">

```ts
const schema = string().optional()

const zodSchemer = schema.build(ZodSchemer)
const zodSchema = zodSchemer.formatter({ defined: true })

// ❌ Input is NOT optional
zodSchema.parse(undefined)
```

</TabItem>
</Tabs>

:::
