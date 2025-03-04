---
title: DTO
sidebar_custom_props:
  sidebarActionType: util
---

# EntityDTO

Builds a [Data Transfer Object](https://en.wikipedia.org/wiki/Data_transfer_object) of the `Entity`.

A DTO is a **JSON-stringifiable object** representing the `Entity` that can be transferred or saved for later use:

```ts
import { EntityDTO } from 'dynamodb-toolbox/entity/actions/dto'

const pokemonEntityDTO = PokemonEntity.build(EntityDTO)

const pokemonEntityJSON = JSON.stringify(pokemonEntityDTO)
```

On DTO retrieval, you can use the `fromDTO` util to re-create the original `Entity`:

```ts
import { fromDTO } from 'dynamodb-toolbox/entity/actions/fromDTO'

const pokemonEntityDTO = JSON.parse(pokemonEntityJSON)

// 👇 Has a similar configuration to the original
const PokemonEntity = fromDTO(pokemonEntityDTO)
```

:::note

All TS types are lost in the process.

:::

:::caution

Note that **functions are not serializable** so, if present, the `computeKey` function is lost in the process: We recommend using [links](../../../4-schemas/2-defaults-and-links/index.md#links) instead.

For the same reason, parts of the `Entity` schema may be lost in the process. See [`SchemaDTO`](../../../4-schemas/17-actions/3-dto.md) for more details.

:::
