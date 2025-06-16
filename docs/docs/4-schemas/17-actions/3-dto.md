---
title: DTO
sidebar_custom_props:
  sidebarActionType: util
---

# SchemaDTO

Builds a [Data Transfer Object](https://en.wikipedia.org/wiki/Data_transfer_object) of the schema.

A DTO is a **JSON-stringifiable object** representing the schema that can be transferred or saved for later use:

```ts
import { SchemaDTO } from 'dynamodb-toolbox/schema/actions/dto'

const pokemonSchemaDTO = pokemonSchema.build(SchemaDTO)

const pokemonSchemaJSON = JSON.stringify(pokemonSchemaDTO)
```

On DTO retrieval, you can use the `fromDTO` util to re-create the original schema:

```ts
import { fromDTO } from 'dynamodb-toolbox/schema/actions/fromDTO'

const pokemonSchemaDTO = JSON.parse(pokemonSchemaJSON)

// 👇 Has a similar configuration to the original
const pokemonSchema = fromDTO(pokemonSchemaDTO)
```

:::note

All TS types are lost in the process.

:::

:::caution

Note that **functions are not serializable**, so parts of the schema may be lost in the process:

- **Getters defaults** are not serialized.
- **Links** are not serialized.
- **Validators** are not serialized.
- On-the-shelf **transformers** like [`prefix`](../18-transformers/2-prefix.md) and [`jsonStringify`](../18-transformers/4-json-stringify.md) are **correctly serialized**, but **custom transformers** are not.

:::
