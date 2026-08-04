---
title: JSONSchemer
sidebar_custom_props:
  sidebarActionType: util
---

# JSONSchemer

Transpiles a DynamoDB-Toolbox schema into a standard [JSON Schema](https://json-schema.org/) describing its **formatted** (i.e. read) value.

This is useful for OpenAPI specs, form generation, LLM/MCP tool definitions, or any tooling that consumes JSON Schema.

Like the [`ZodSchemer`](./5-zod-schemer.md), the **transpilation itself is type-safe**, which means the **resulting JSON Schema type can be introspected** and **type inference is preserved**:

```ts
import { JSONSchemer } from 'dynamodb-toolbox/schema/actions/jsonSchemer'

const pokemonSchema = item({
  pokemonId: string(),
  level: number(),
  pokeType: string()
    .enum('fire', 'water', 'grass')
    .optional()
})

const jsonSchema = pokemonSchema
  .build(JSONSchemer)
  .formattedValueSchema()
// =>
// {
//   type: 'object',
//   properties: {
//     pokemonId: { type: 'string' },
//     level: { type: 'number' },
//     pokeType: { type: 'string' }
//   },
//   required: ['pokemonId', 'level']
// }
```

:::note

The generated JSON Schema describes the **formatted value**, so it mirrors what the [`Formatter`](./2-format.md) action returns (not the raw saved shape). [`hidden`](../9-string/index.md#hidden) attributes are stripped, and [`optional`](../9-string/index.md#required) attributes are excluded from `required`.

:::

## Methods

### `formattedValueSchema()`

<p style={{ marginTop: '-15px' }}><i><code>() => FormattedValueJSONSchema&lt;SCHEMA&gt;</code></i></p>

Returns the JSON Schema of the schema's formatted value:

```ts
const jsonSchema = pokemonSchema
  .build(JSONSchemer)
  .formattedValueSchema()
```

Only attributes that appear in the formatted value are included. `item` and `map` schemas produce `type: 'object'` (with `additionalProperties: false` when [`strict`](../14-item/index.md#strict)), `list`/`set`/`tuple` produce `type: 'array'`, `record` produces `type: 'object'` with `propertyNames`/`additionalProperties`, and [`anyOf`](../17-anyOf/index.md) produces an `anyOf` union.
