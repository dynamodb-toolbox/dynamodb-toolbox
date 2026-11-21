---
title: ZodSchemer
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ZodSchemer

:::note

`ZodSchemer` requires the `zod` dependency to be installed as (optional) peer dependency:

```bash
npm install zod
```

Both `zod` v3 and v4 are supported, through a subpath each.

:::

Transpiles DynamoDB-Toolbox schemas to [Zod Schemas](https://github.com/colinhacks/zod). Note that the **transpilation itself is type-safe**, which means that **resulting schema types can be introspected** and **type inference is preserved**:

```ts
import { ZodSchemer } from 'dynamodb-toolbox/schema/actions/zodSchemer/v4'

const zodSchemer = pokemonSchema.build(ZodSchemer)

const zodParser = zodSchemer.parser()
const parsed = zodParser.parse(input)
// => TransformedValue<typeof pokemonSchema>

const zodFormatter = zodSchemer.formatter()
const formatted = zodFormatter.parse(parsed)
// => FormattedValue<typeof pokemonSchema>
```

:::note

Because DynamoDB-Toolbox schema are more flexible than Zod Schemas ([Parsing](./1-parse.md) vs [Formatting](./2-format.md), Item vs Keys, Updates syntax etc.), you may need to transpile **several Zod Schemas** for different contexts.

:::

You can also derive schemas from Zod schemas with the `fromZodSchema` util (with [some limitations](#fromzodschema)):

```ts
import { z } from 'zod/v4'
import { fromZodSchema } from 'dynamodb-toolbox/schema/actions/fromZodSchema/v4'

const zodSchema = z.object({
  firstName: z.string(),
  lastName: z.string()
})
const ddbToolboxSchema = fromZodSchema(zodSchema)
```

Again the **transpilation itself is type-safe** and **type inference is preserved**, although the resulting schema may have to be tweaked to introduce DynamoDB related features (keys, links, transforms etc.).

## Which version?

`zod` ships both of its major versions in a single package, so DynamoDB-Toolbox has one implementation of each action per version, exposed through its own subpath:

| Subpath                                            | Zod schemas                                              |
| -------------------------------------------------- | -------------------------------------------------------- |
| `dynamodb-toolbox/schema/actions/zodSchemer/v4`    | v4 ([Classic](https://zod.dev/packages/zod))             |
| `dynamodb-toolbox/schema/actions/zodSchemer/v3`    | v3                                                       |
| `dynamodb-toolbox/schema/actions/fromZodSchema/v4` | v4, Classic **or** [Mini](https://zod.dev/packages/mini) |
| `dynamodb-toolbox/schema/actions/fromZodSchema/v3` | v3                                                       |

The `zod` peer range is `^3.25.0 || ^4.0.0`: the `zod/v3` and `zod/v4` permalinks only exist from `3.25.0` onward, so an install still on `zod@3` can emit v4 schemas by importing them from `zod/v4`.

## ⚠️ Known Limitations

### ZodSchemer

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
})

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
zodSchema.parse({})
```

Due to some discrepancies between schema systems, [discriminated unions](../17-anyOf/index.md#discriminate) also suffer from some minor limitations.

| Discriminated `anyOf` with an element that is...  | v3  | v4                           |
| ------------------------------------------------- | :-: | ---------------------------- |
| **remapped** (i.e. holding a `savedAs` attribute) | ❌  | ✅ `parser` / ❌ `formatter` |
| **refined** (i.e. holding a `validate`)           | ❌  | ✅                           |
| a **discriminated** `anyOf` (i.e. nested)         | ❌  | ✅                           |
| a **non-discriminated** `anyOf`                   | ❌  | ❌                           |

- Since v4, **discriminated AND remapped** `maps` can be transpiled on the `parser` side but not on the `formatter` side, where it is a `preprocess`:

```ts
const schema = anyOf(
  map({
    type: string().const('a'),
    name: string().savedAs('_n')
  }),
  map({ type: string().const('b') })
).discriminate('type')

// ✅ Success
schema.build(ZodSchemer).parser().parse(input)

const zodFormatter = schema.build(ZodSchemer).formatter()
// ❌ Fails: Zod cannot read the discriminant through a `preprocess`
zodFormatter.parse(savedItem)
```

:::note

Opting out of transformations removes the `preprocess`, and the `formatter` works again:

```ts
// ✅ Success
schema
  .build(ZodSchemer)
  .formatter({ transform: false })
  .parse(input)
```

:::

- Since v4, **discriminated AND refined** `maps` can be transpiled:

```ts
const schema = anyOf(
  map({ type: string().const('a') }).validate(...),
  map({ type: string().const('b') }).validate(...)
).discriminate('type')

const zodSchema = schema.build(ZodSchemer).parser()
// ✅ Success
zodSchema.parse(input)
```

- Since v4, **nested discriminated union** can be transpiled:

```ts
const schema = anyOf(
  map({ type: string().const('a') }),
  anyOf(
    map({ type: string().const('b') }),
    map({ type: string().const('c') })
  ).discriminate('type')
).discriminate('type')

// ✅ Success
const zodSchema = schema.build(ZodSchemer).parser()
zodSchema.parse(input)
```

### fromZodSchema

Binary schemas (`Uint8Array`) do not exist in `zod` and cannot be transpiled (see [this issue](https://github.com/colinhacks/zod/issues/2597)).

Refinements are transpiled but `transforms` are not. The resulting schema validates its input and leaves it untouched. `preprocesses` are the mirror case: the wrapped schema is kept and enforced, but the preprocessing is dropped:

```ts
const refined = z.string().refine(value => value.length > 0)

const refinedSchema = fromZodSchema(refined)
refinedSchema.build(Parser).parse('') // ❌ Fails

const transformed = z
  .string()
  .transform(value => value.trim())

const transformedSchema = fromZodSchema(transformed)
transformedSchema.build(Parser).parse(' foo ') // => ' foo '

const preprocessed = z.preprocess(
  value => Number(value),
  z.number()
)

const preprocessedSchema = fromZodSchema(preprocessed)
preprocessedSchema.build(Parser).parse('42') // ❌ Fails
```

Intersections are not supported, as well as types that DynamoDB has no equivalent for (`Dates`, `NaNs`, `InstanceOf` etc.). Rather than throwing, they **degrade to an `any` schema** carrying the Zod schema's output type, so type inference is preserved but **nothing is validated at runtime**:

```ts
const schema = fromZodSchema(z.date())
// => any().castAs<Date>()

// ⚠️ Does not throw
schema.build(Parser).parse('not a date')
```

## Metadata

The [`meta`](../1-usage/index.md#schemas-props) props are applied to the resulting Zod schema, on both the `parser` and the `formatter`:

```ts
const levelSchema = number().meta({
  title: 'Level',
  description: 'The Pokémon level'
})

const zodSchema = levelSchema.build(ZodSchemer).parser()

zodSchema.description
// => 'The Pokémon level'
```

With `zod` v4, the **whole `meta` store** is carried over through [`.meta()`](https://zod.dev/metadata), so `title`, `examples` and any custom key survive as well:

```ts
zodSchema.meta()
// => { title: 'Level', description: 'The Pokémon level' }
```

:::warning

`zod` v3 only supports [`.describe()`](https://zod.dev/?id=describe), so every other key (including `meta.title` and `meta.examples`) is silently dropped by the `/v3` subpath.

:::

## Methods

### `parser(...)`

<p style={{ marginTop: '-15px' }}><i><code>(options?: ZodParserOptions) => ZodParser&lt;SCHEMA&gt;</code></i></p>

Creates a `zodSchema` to use for Item parsing. It includes defaults, custom validation and transformations (see the [`Parser`](./1-parse.md) action for more details on parsing):

```ts
import { z } from 'zod/v4'

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
import { z } from 'zod/v4'

const nameSchema = item({
  firstName: string().savedAs('_f'),
  lastName: string().validate(input => input.length > 1)
})

const zodFormatter = nameSchema
  .build(ZodSchemer)
  .formatter()

// ❌ `_f` missing
zodFormatter.parse({ lastName: 'Dow' })
// ❌ `lastName` too short
zodFormatter.parse({ _f: 'John', lastName: '' })
// ✅  Success
zodFormatter.parse({ _f: 'John', lastName: 'Dow' })

type FormattedName = z.infer<typeof zodFormatter>
// => { firstName: string, lastName: string } 🙌
```

You can provide additional options. Available options:

| Option      |   Type    | Default | Description                                                                                                        |
| ----------- | :-------: | :-----: | ------------------------------------------------------------------------------------------------------------------ |
| `transform` | `boolean` | `true`  | Whether to include pre-validation transformations (i.e. `savedAs` and `transform`) in the resulting schema or not. |
| `format`    | `boolean` | `true`  | Whether to strip `hidden` attributes from the resulting schema or not.                                             |
| `partial`   | `boolean` | `false` | Wether to make every attribute (flat or deep) `optional` in the schema or not.                                     |
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
