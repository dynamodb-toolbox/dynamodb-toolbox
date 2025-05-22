---
title: Finder
sidebar_custom_props:
  sidebarActionType: util
---

# Finder

Enables navigating through the provided schema.

## Methods

### `search(...)`

<p style={{ marginTop: '-15px' }}><i><code>(path: string) => SubSchema[]</code></i></p>

```ts
import { Finder } from 'dynamodb-toolbox/schema/actions/finder'

const pokemonSchema = item({
  evolutions: list(map({ level: number() })).savedAs('_e'),
  ...
})

const finder = pokemonSchema.build(Finder)
const subschemas = finder.search('evolutions[1].level')

const [levelSubSchema] = subschemas
```

:::info

The path formalism is the same as within [`Conditions`](../../3-entities/4-actions/19-parse-condition/index.md#paths) and [`Projections`](../../3-entities/4-actions/20-parse-paths/index.md#paths).

:::

The `.search()` method may return **an empty array** if no subschema is found for the provided path. It may also return **several subschemas** if several options of an [`anyOf`](../16-anyOf/index.md) attribute match the provided path.

## SubSchemas

Subschemas are [Schema Actions](../../1-getting-started/3-usage/index.md#methods-vs-actions) that also contain a path:

```ts
const levelSchema = levelSubSchema.schema
// => number()

const formattedPath = levelSubSchema.formattedPath
const originalStrPath = formattedPath.strPath
// => 'evolutions[1].level'
const originalArrPath = formattedPath.arrayPath
// => ['evolutions', 1, 'level']

const transformedPath = levelSubSchema.transformedPath
const transformedStrPath = transformedPath.strPath
// => '_e[1].level'
const transformedArrPath = transformedPath.arrayPath
// => ['_e', 1, 'level']
```
