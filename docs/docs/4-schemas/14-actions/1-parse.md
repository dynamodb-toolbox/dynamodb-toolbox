---
title: Parse
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Parser

Given an input of any type and a mode, validates that **it respects the schema**:

```ts
import { Parser } from 'dynamodb-toolbox/schema/actions/parse'

const validPokemon = pokemonSchema
  .build(Parser)
  .parse(pokemon)
```

The default mode is `'put'`, but you can switch it to `'update'` or `'key'` if needed:

```ts
const validKey = pokemonSchema.build(Parser).parse(
  key,
  // Additional options
  { mode: 'key' }
)
```

In DynamoDB-Toolbox, parsing is done in **4 steps**:

```mermaid
flowchart LR
  classDef mmddescription fill:none,stroke:none,font-style:italic
  classDef mmdcontainer fill:#eee4,stroke-width:1px,stroke-dasharray:3,stroke:#ccc,font-weight:bold,font-size:large
  classDef mmdspace fill:none,stroke:none,color:#0000

  input(Input)
  input:::mmddescription

  subgraph Filling
    space1( ):::mmdspace

    defaults(Applies<br/><b>defaults<b/>)
    links(Applies<br/><b>links<b/>)
    fillDescr(...clones the item, adds<br/><b>defaults</b> and <b>links</b><br/>):::mmddescription

    defaults --> links
  end

  input .-> defaults

  Filling:::mmdcontainer

  subgraph Parsing
    space2( ):::mmdspace

    parsing(Throws an<br/><b>error</b> if invalid)
    parsingDescr(...<b>validates</b> the item.):::mmddescription

    links --> parsing
  end


  Parsing:::mmdcontainer

  subgraph Transforming
    space3( ):::mmdspace

    transform(Last <b>transforms<b/>)
    transformDescr(...<b>renames</b><br/>and <b>transforms</b>.):::mmddescription

    parsing-->transform
  end

  Transforming:::mmdcontainer

  output(Output)
  output:::mmddescription

  transform .-> output

```

:::noteExample

Here are **step-by-step** parsing examples:

<details className="details-in-admonition">
<summary>☝️ <b>Schema</b></summary>

```ts
const now = () => new Date().toISOString()

const pokemonSchema = schema({
  // key attributes
  pokemonClass: string()
    .key()
    .transform(prefix('POKEMON'))
    .savedAs('partitionKey'),
  pokemonId: string().key().savedAs('sortKey'),

  // timestamps
  created: string().default(now),
  updated: string()
    .required('always')
    .putDefault(now)
    .updateDefault(now),

  // other attributes
  name: string().optional(),
  level: number().default(1)
}).and(prevSchema => ({
  levelPlusOne: number().link<typeof prevSchema>(
    ({ level }) => level + 1
  )
}))
```

</details>

<details className="details-in-admonition">
<summary>🔎 <b><code>'put'</code> mode</b></summary>

<Tabs>
<TabItem value="input" label="Input">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
  "name": "Pikachu"
}
```

</TabItem>
<TabItem value="defaulted" label="Defaulted">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
+ "created": "2022-01-01T00:00:00.000Z",
+ "modified": "2022-01-01T00:00:00.000Z",
  "name": "Pikachu",
+ "level": 1,
}
```

</TabItem>
<TabItem value="linked" label="Linked">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
  "created": "2022-01-01T00:00:00.000Z",
  "modified": "2022-01-01T00:00:00.000Z",
  "name": "Pikachu",
  "level": 1,
+ "levelPlusOne": 2,
}
```

</TabItem>
<TabItem value="parsed" label="Parsed">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
  "created": "2022-01-01T00:00:00.000Z",
  "modified": "2022-01-01T00:00:00.000Z",
  "name": "Pikachu",
  "level": 1,
  "levelPlusOne": 2,
}
+ Item is valid ✅
```

</TabItem>
<TabItem value="transformed" label="Transformed">

```diff
{
- "pokemonClass": "pikachu",
+ "partitionKey": "POKEMON#pikachu",
- "pokemonId": "123",
+ "sortKey": "123",
  "created": "2022-01-01T00:00:00.000Z",
  "modified": "2022-01-01T00:00:00.000Z",
  "name": "Pikachu",
  "level": 1,
  "levelPlusOne": 2,
}
```

</TabItem>
</Tabs>

</details>

<details className="details-in-admonition">
<summary>🔎 <b><code>'key'</code> mode</b></summary>

<Tabs>
<TabItem value="input" label="Input">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
}
+ (Only key attributes are required)
```

</TabItem>
<TabItem value="defaulted" label="Defaulted">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
}
+ No default to apply ✅
```

</TabItem>
<TabItem value="linked" label="Linked">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
}
+ No link to apply ✅
```

</TabItem>
<TabItem value="parsed" label="Parsed">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
}
+ Item is valid ✅
```

</TabItem>
<TabItem value="transformed" label="Transformed">

```diff
{
- "pokemonClass": "pikachu",
+ "partitionKey": "POKEMON#pikachu",
- "pokemonId": "123",
+ "sortKey": "123",
}
```

</TabItem>
</Tabs>

</details>

<details className="details-in-admonition">
<summary>🔎 <b><code>'update'</code> mode</b></summary>

<Tabs>
<TabItem value="input" label="Input">

```diff
{
  "pokemonClass": "bulbasaur",
  "pokemonId": "123",
  "name": "PlantyDino",
}
```

</TabItem>
<TabItem value="defaulted" label="Defaulted">

```diff
{
  "pokemonClass": "bulbasaur",
  "pokemonId": "123",
+ "modified": "2022-01-01T00:00:00.000Z",
  "name": "PlantyDino",
}
```

</TabItem>
<TabItem value="linked" label="Linked">

```diff
{
  "pokemonClass": "bulbasaur",
  "pokemonId": "123",
  "modified": "2022-01-01T00:00:00.000Z",
  "name": "PlantyDino",
}
+ No updateLink to apply ✅
```

</TabItem>
<TabItem value="parsed" label="Parsed">

```diff
{
  "pokemonClass": "bulbasaur",
  "pokemonId": "123",
  "modified": "2022-01-01T00:00:00.000Z",
  "name": "PlantyDino",
}
+ Item is valid ✅
```

</TabItem>
<TabItem value="transformed" label="Transformed">

```diff
{
- "pokemonClass": "bulbasaur",
+ "partitionKey": "POKEMON#bulbasaur",
- "pokemonId": "123",
+ "sortKey": "123",
  "modified": "2022-01-01T00:00:00.000Z",
  "name": "PlantyDino",
}
```

</TabItem>
</Tabs>

</details>

:::

## Methods

### `parse(...)`

<p style={{ marginTop: '-15px' }}><i><code>(input: unknown, options?: ParsingOptions) => ParsedValue&lt;SCHEMA&gt;</code></i></p>

Parses an input of any type:

```ts
const parsedValue = pokemonSchema.build(Parser).parse(input)
```

You can provide options as second argument. Available options are:

| Option           |              Type              | Default | Description                                                                                                                        |
| ---------------- | :----------------------------: | :-----: | ---------------------------------------------------------------------------------------------------------------------------------- |
| `fill`           |           `boolean`            | `true`  | Wether to complete the input (with `defaults` and `links`) prior to validation or not.                                             |
| `transform`      |           `boolean`            | `true`  | Wether to transform the input (with `savedAs` and `transform`) after validation or not.                                            |
| `mode`           | `'put'`, `'key'` or `'update'` | `'put'` | The mode of the parsing: Impacts which `default` and `link` should be used, as well as requiredness during validation.             |
| `parseExtension` |          _(internal)_          |    -    | Dependency injection required to parse extended syntax (`$get`, `$add` etc.) when using the `'update'` mode (check example below). |

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

const validPokemon = pokemonSchema.build(Parser).parse(pokemon)
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const validKey = pokemonSchema
  .build(Parser)
  .parse({ pokemonId: 'pikachu1' }, { mode: 'key' })
```

</TabItem>
<TabItem value="update" label="Update">

```ts
const validUpdate = pokemonSchema
  .build(Parser)
  .parse(
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

const validUpdate = pokemonSchema.build(Parser).parse(
  // 👇 `$add` is an extension, so `parseExtension`  is needed
  { pokemonId: 'pikachu1', customName: $add(1) },
  { mode: 'update', parseExtension: parseUpdateExtension }
)
```

</TabItem>
</Tabs>

:::

You can use the `ParsedValue` type to explicitely type an object as a parsing output:

```ts
import type { ParsedValue } from 'dynamodb-toolbox/schema/actions/parse'

const parsedKey: ParsedValue<
  typeof pokemonSchema,
  // 👇 Optional options
  { mode: 'key' }
  // ❌ Throws a type error
> = { invalid: 'input' }
```

### `reparse(...)`

<p style={{ marginTop: '-15px' }}><i><code>(input: ParsedValue&lt;SCHEMA&gt;, options?: ParsingOptions) => ParsedValue&lt;SCHEMA&gt;</code></i></p>

Similar to [`.parse`](#parse), but with the input correctly typed (taking the mode into account) instead of `unknown`:

```ts
pokemonSchema
  .build(Parser)
  // ❌ Throws a type error
  .reparse({ invalid: 'input' })
```

You can use the `ParserInput` type to explicitely type an object as a parsing input:

```ts
import type { ParserInput } from 'dynamodb-toolbox/schema/actions/parse'

const keyInput: ParserInput<
  typeof pokemonSchema,
  // 👇 Optional options
  { mode: 'key' }
  // ❌ Throws a type error
> = { invalid: 'input' }
```

### `start(...)`

<p style={{ marginTop: '-15px' }}><i><code>(input: unknown, options?: ParsingOptions) => Generator&lt;ParsedValue&lt;SCHEMA&gt;&gt;</code></i></p>

Similar to [`.parse`](#parse), but will return the underlying [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) to inspect the intermediate results of the parsing steps:

:::noteExamples

<Tabs>
<TabItem value="complete" label="Complete">

```ts
const parsingGenerator = pokemonSchema
  .build(Parser)
  .start(pokemon)

const defaultedPokemon = parsingGenerator.next().value
const linkedPokemon = parsingGenerator.next().value
const parsedPokemon = parsingGenerator.next().value
const transformedPokemon = parsingGenerator.next().value
```

</TabItem>
<TabItem value="transformed" label="Transformed only">

```ts
const parsingGenerator = pokemonSchema
  .build(Parser)
  .start(pokemon, { fill: false })

// 👇 No `fill` step
const parsedPokemon = parsingGenerator.next().value
const transformedPokemon = parsingGenerator.next().value
```

</TabItem>
<TabItem value="filled" label="Filled only">

```ts
const parsingGenerator = pokemonSchema
  .build(Parser)
  .start(pokemon, { transform: false })

const defaultedPokemon = parsingGenerator.next().value
const linkedPokemon = parsingGenerator.next().value
const parsedPokemon = parsingGenerator.next().value
// 👆 No `transform` step
```

</TabItem>
</Tabs>

:::
