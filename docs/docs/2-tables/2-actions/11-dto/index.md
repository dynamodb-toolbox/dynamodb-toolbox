---
title: DTO
sidebar_custom_props:
  sidebarActionType: util
---

# TableDTO

Builds a [Data Transfer Object](https://en.wikipedia.org/wiki/Data_transfer_object) of the `Table`.

A DTO is a **JSON-stringifiable object** representing the `Table` that can be transferred or saved for later use:

```ts
import { TableDTO } from 'dynamodb-toolbox/table/actions/dto'

const pokeTableDTO = PokeTable.build(TableDTO)

const pokeTableJSON = JSON.stringify(tableDTO)
```

On DTO retrieval, you can use the `fromDTO` util to re-create the original `Table`:

```ts
import { fromDTO } from 'dynamodb-toolbox/table/actions/fromDTO'

const pokeTableDTO = JSON.parse(pokeTableJSON)

// 👇 Has the same configuration as the original
const PokeTable = fromDTO(pokeTableDTO)
```

:::note

All TS types are lost in the process.

:::
