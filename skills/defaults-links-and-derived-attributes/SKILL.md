---
name: defaults-links-and-derived-attributes
description: >
  Use default, putDefault, updateDefault, keyDefault, link, putLink,
  updateLink, and keyLink in dynamodb-toolbox to derive keys and denormalized
  fields safely. Load this when centralizing derived data, handling deleted
  source fields, or mixing links with update extensions like $add.
type: core
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/4-schemas/2-defaults-and-links/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/schema/actions/parse/schema.ts"
  - "dynamodb-toolbox/dynamodb-toolbox:src/entity/actions/parse/entityParser.ts"
---

# DynamoDB-Toolbox - Defaults, Links, and Derived Attributes

Use schema defaults and links to keep derived values close to persistence rules instead of duplicating them across services. The critical distinction is put versus update behavior, especially for key fields and update extensions.

## Setup

```ts
import { item } from 'dynamodb-toolbox/schema/item'
import { number } from 'dynamodb-toolbox/schema/number'
import { string } from 'dynamodb-toolbox/schema/string'
import { isExtension } from 'dynamodb-toolbox/entity/actions/update/symbols'

const baseSchema = item({
  trainerId: string().key(),
  pokemonId: string().key(),
  level: number().putDefault(1)
})

const pokemonSchema = baseSchema.and(prev => ({
  pk: string().key().link<typeof prev>(({ trainerId }) => `TRAINER#${trainerId}`),
  sk: string().key().link<typeof prev>(({ pokemonId }) => `POKEMON#${pokemonId}`),
  levelLabel: string().updateLink<typeof prev>(({ level }) => {
    if (level === undefined || isExtension(level)) return undefined
    return `L${level}`
  })
}))
```

## Core Patterns

### Call `.key()` before `.default()` on key fields

```ts
const pk = string().key().default('TRAINER#default')
```

That preserves `keyDefault` semantics.

### Build linked schemas in two steps when you want strong inference

```ts
const base = item({ trainerId: string().key(), pokemonId: string().key() })
const full = base.and(prev => ({
  pk: string().key().link<typeof prev>(({ trainerId }) => `TRAINER#${trainerId}`)
}))
```

### Guard `updateLink` against extensions and deletions

```ts
const full = base.and(prev => ({
  slug: string().updateLink<typeof prev>(({ pokemonId }) => {
    if (pokemonId === undefined || isExtension(pokemonId)) return undefined
    return pokemonId.toLowerCase()
  })
}))
```

## Common Mistakes

### HIGH Calling default before key on key attributes

Wrong:

```ts
const pk = string().default('TRAINER#1').key()
```

Correct:

```ts
const pk = string().key().default('TRAINER#1')
```

The shorthand only becomes `keyDefault` when the field is already marked as a key.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/4-schemas/2-defaults-and-links/index.md

### CRITICAL Forgetting to tag linked key fields with key

Wrong:

```ts
const schema = item({ a: string().key(), b: string().key() }).and(prev => ({
  pk: string().link<typeof prev>(({ a, b }) => `${a}#${b}`)
}))
```

Correct:

```ts
const schema = item({ a: string().key(), b: string().key() }).and(prev => ({
  pk: string().key().link<typeof prev>(({ a, b }) => `${a}#${b}`)
}))
```

Derived primary or index keys still need `key()` so entity key parsing and validation stay correct.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/4-schemas/2-defaults-and-links/index.md

### HIGH Assuming updateLink receives only plain values

Wrong:

```ts
levelLabel: string().updateLink<typeof prev>(({ level }) => `L${level + 1}`)
```

Correct:

```ts
levelLabel: string().updateLink<typeof prev>(({ level }) => {
  if (level === undefined || isExtension(level)) return undefined
  return `L${level + 1}`
})
```

Update links can receive extension objects like `$add`, so arithmetic on the raw input is unsafe.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/4-schemas/2-defaults-and-links/index.md

### HIGH Not handling deleted source attributes in links

Wrong:

```ts
slug: string().updateLink<typeof prev>(({ title }) => title.toLowerCase())
```

Correct:

```ts
slug: string().updateLink<typeof prev>(({ title }) => {
  if (title === undefined || isExtension(title)) return undefined
  return title.toLowerCase()
})
```

Links that assume a dependency is always present break when that attribute is removed or replaced by update syntax.

Source: maintainer interview

## References

- [Default and link modes](references/default-link-modes.md)