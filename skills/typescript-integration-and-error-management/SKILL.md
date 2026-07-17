---
name: typescript-integration-and-error-management
description: >
  Use dynamodb-toolbox helper types like InputItem, ValidItem, SavedItem,
  FormattedItem, and DynamoDBToolboxError with correct TypeScript narrowing.
  Load this when type-checking entity code, handling Toolbox errors, or
  deciding whether a value is in saved or formatted shape.
type: core
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/3-type-inference/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/6-error-management/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/errors/dynamoDBToolboxError.ts"
  - "dynamodb-toolbox/dynamodb-toolbox:src/entity/index.ts"
---

# DynamoDB-Toolbox - TypeScript Integration and Error Management

Toolbox is most useful when compile-time item shapes and runtime parsing errors reinforce each other. Distinguish saved versus formatted shapes, and narrow Toolbox errors explicitly.

## Setup

```ts
import type { FormattedItem, SavedItem } from 'dynamodb-toolbox/entity'
import { DynamoDBToolboxError } from 'dynamodb-toolbox/errors'

type SavedPokemon = SavedItem<typeof PokemonEntity>
type FormattedPokemon = FormattedItem<typeof PokemonEntity>

const handleError = (error: unknown) => {
  if (!(error instanceof DynamoDBToolboxError)) {
    throw error
  }

  console.error(error.code, error.path, error.payload)
}
```

## Core Patterns

### Use saved and formatted shapes for different moments

```ts
type SavedPokemon = SavedItem<typeof PokemonEntity>
type FormattedPokemon = FormattedItem<typeof PokemonEntity>
```

Saved shapes include persisted field names and internal attributes; formatted shapes reflect application-facing names and visibility rules.

### Narrow Toolbox errors before accessing typed fields

```ts
if (error instanceof DynamoDBToolboxError) {
  console.error(error.code)
}
```

## Common Mistakes

### HIGH Handling Toolbox failures as generic `Error`

Wrong:

```ts
catch (error) {
  console.error((error as Error).message)
}
```

Correct:

```ts
catch (error) {
  if (error instanceof DynamoDBToolboxError) {
    console.error(error.code, error.path, error.payload)
  }
}
```

Generic error handling discards the structured code, path, and payload fields that make Toolbox failures actionable.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/6-error-management/index.md

### HIGH Using the wrong `instanceof` precedence

Wrong:

```ts
if (!error instanceof DynamoDBToolboxError) {
  throw error
}
```

Correct:

```ts
if (!(error instanceof DynamoDBToolboxError)) {
  throw error
}
```

This pattern appeared in a docs bug and remains a legacy-risk pattern even after the docs fix.

Source: maintainer interview

### MEDIUM Typing saved and formatted items interchangeably

Wrong:

```ts
type Pokemon = SavedItem<typeof PokemonEntity>
const created = pokemon.created
```

Correct:

```ts
type Pokemon = FormattedItem<typeof PokemonEntity>
const created = pokemon.created
```

Saved items use persisted names and internal attributes, while formatted items reflect application-facing names and hidden-field behavior.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/2-internal-attributes/index.md

### HIGH Manually declaring `created` and `modified` instead of using timestamps

Wrong:

```ts
const schema = item({
  pokemonId: string().key(),
  created: string(),
  modified: string()
})
```

Correct:

```ts
const entity = new Entity({
  name: 'POKEMON',
  table: AppTable,
  schema: item({ pokemonId: string().key() })
})
```

Timestamp fields already exist by default, so manually re-declaring them is a strong AI-generated smell and can collide with internal attribute behavior.

Source: maintainer interview