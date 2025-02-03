---
title: Type Inference
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Type Inference

DynamoDB-Toolbox exposes several generic types to **infer custom types** from your entities.

Which one you should use depends on your usage context, for instance, whether it’s within a [write](#writes) or a [read](#reads) operation.

## Writes

For write operations, DynamoDB-Toolbox exposes the following generic types:

- `ValidItem`: A valid entity item
- `InputItem`: Similar to `ValidItem`, but with defaulted and linked attributes optional
- `TransformedItem`: A valid entity item after transformation

```mermaid
flowchart LR
  classDef mmddescription fill:none,stroke:none
  classDef mmdcontainer fill:#eee4,stroke-width:1px,stroke-dasharray:3,stroke:#ccc,font-weight:bold,font-size:large

  InputItem["<b>InputItem</b><br/><i>(+ KeyInputItem)</i>"]

  subgraph Fill[ ]
    FillDescription["<b>Fill</b>"]:::mmddescription
    fillDescr(+ defaults<br/>+ links):::mmddescription
  end
  Fill:::mmdcontainer

  ValidItem["<b>ValidItem</b>"]

  InputItem .- FillDescription
  FillDescription .-> ValidItem

  subgraph Transform[ ]
    TransformDescription["<b>Transform</b>"]:::mmddescription
    transformDescr(+ renaming<br/>+ transforms):::mmddescription
  end
  Transform:::mmdcontainer

  TransformedItem["<b>TransformedItem</b><br/><i>(+ SavedItem)</i>"]

  ValidItem .- TransformDescription
  TransformDescription .-> TransformedItem

```

```ts
import type {
  InputItem,
  ValidItem,
  TransformedItem
} from 'dynamodb-toolbox/entity'

type Input = InputItem<typeof PokemonEntity>
type Valid = ValidItem<typeof PokemonEntity>
type Transformed = TransformedItem<typeof PokemonEntity>
```

By default, those generics use the `put` write mode, but you can switch to the `key` or `update` modes with the `mode` option. This impacts which the presence and requiredness of attributes:

```ts
type ValidKey = ValidItem<
  typeof PokemonEntity,
  { mode: 'key' }
>
type ValidUpdate = ValidItem<
  typeof PokemonEntity,
  { mode: 'update' }
>
```

:::note[Example]

Here are **step-by-step** examples:

<details className="details-in-admonition">
<summary>☝️ <b>Entity</b></summary>

```ts
const PokemonEntity = new Entity({
  table,
  schema: schema({
    // key attributes
    pokemonClass: string()
      .key()
      .transform(prefix('POKEMON'))
      .savedAs('partitionKey'),
    pokemonId: string().key().savedAs('sortKey'),

    // other attributes
    name: string().optional(),
    level: number().default(1)
  }).and(prevSchema => ({
    levelPlusOne: number().link<typeof prevSchema>(
      ({ level }) => level + 1
    )
  }))
  // timestamps
  timestamps: true
  ...
})
```

</details>

<details className="details-in-admonition">
<summary>🔎 <b><code>'put'</code> mode</b></summary>

<Tabs>
<TabItem value="input" label="InputItem">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
  "name": "Pikachu"
}
```

</TabItem>
<TabItem value="valid" label="ValidItem">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
+ "created": "2022-01-01T00:00:00.000Z",
+ "modified": "2022-01-01T00:00:00.000Z",
  "name": "Pikachu",
+ "level": 1,
+ "levelPlusOne": 2,
}
```

</TabItem>
<TabItem value="transformed" label="TransformedItem">

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
<TabItem value="input" label="InputItem">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
}
+ (Only key attributes are required)
```

</TabItem>
<TabItem value="valid" label="ValidItem">

```diff
{
  "pokemonClass": "pikachu",
  "pokemonId": "123",
}
```

</TabItem>
<TabItem value="transformed" label="TransformedItem">

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
<TabItem value="input" label="InputItem">

```diff
{
  "pokemonClass": "bulbasaur",
  "pokemonId": "123",
  "name": "PlantyDino",
}
```

</TabItem>
<TabItem value="valid" label="ValidItem">

```diff
{
  "pokemonClass": "bulbasaur",
  "pokemonId": "123",
+ "modified": "2022-01-01T00:00:00.000Z",
  "name": "PlantyDino",
}
```

</TabItem>
<TabItem value="transformed" label="TransformedItem">

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

For convenience, DynamoDB-Toolbox also exposes the following generic types:

- `KeyInputItem`: Similar to `InputItem` in the `key` mode.
- `SavedItem`: Similar to `TransformedItem` but adds the [`PrimaryKey`](../../2-tables/2-actions/8-parse-primary-key/index.md#output) of the Entity's Table

```ts
import {
  KeyInputItem,
  SavedItem
} from 'dynamodb-toolbox/entity'

type KeyInput = KeyInputItem<typeof PokemonEntity>
type Saved = SavedItem<typeof PokemonEntity>
```

## Reads

For read operations, DynamoDB-Toolbox exposes the following generic types:

- `ReadItem`: A valid entity item (differs from `ValidItem` as options are different, see below)
- `FormattedItem`: Similar to `ReadItem`, but with `hidden` attributes omitted

```mermaid
flowchart RL
  classDef mmddescription fill:none,stroke:none
  classDef mmdcontainer fill:#eee4,stroke-width:1px,stroke-dasharray:3,stroke:#ccc,font-weight:bold,font-size:large

  TransformedItem["<b>TransformedItem</b>"]

  subgraph Transform[ ]
    TransformDescription["<b>Transform</b><br/>(backward)"]:::mmddescription
    fillDescr("+ renaming<br/>+ transforms<br/>(backward)"):::mmddescription
  end
  Transform:::mmdcontainer

  ReadItem["<b>ReadItem</b>"]

  TransformedItem .- TransformDescription
  TransformDescription .-> ReadItem

  subgraph Format[ ]
    FormatDescription["<b>Format</b>"]:::mmddescription
    transformDescr(+ omits hidden<br/>attributes):::mmddescription
  end
  Format:::mmdcontainer

  FormattedItem["<b>FormattedItem</b>"]

  ReadItem .- FormatDescription
  FormatDescription .-> FormattedItem

```

```ts
import type {
  ReadItem,
  FormattedItem
} from 'dynamodb-toolbox/schema'

type Read = ReadItem<typeof PokemonEntity>
type Formatted = FormattedItem<typeof PokemonEntity>
```

By default, those generics return complete items, but you can filter attributes and/or apply `Partial` (deeply) with the `attributes` and `partial` options:

```ts
type Filtered = FormattedItem<
  typeof PokemonEntity,
  { attributes: 'level' | 'name' | 'deep.attr[0].path' }
>
type Partial = FormattedItem<
  typeof PokemonEntity,
  { partial: true }
>
```

```

```
