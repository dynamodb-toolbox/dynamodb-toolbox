---
title: '-'
---

## Common options

All attributes share the following options:

- `required` _(string?="atLeastOnce")_ Tag a root attribute or Map sub-attribute as **required**. Possible values are:
  - `"atLeastOnce"` Required in `PutItem` commands
  - `"never"`: Optional in all commands
  - `"always"`: Required in all commands

```tsx
// Equivalent
const pokemonName = string().required()
const pokemonName = string({ required: 'atLeastOnce' })

// `.optional()` is a shorthand for `.required(”never”)`
const pokemonName = string().optional()
const pokemonName = string({ required: 'never' })
```

:::info

A very important breaking change from previous versions is that **root attributes and Map sub-attributes are now required by default**. This was made so **composition and validation work better together**.

:::

- `hidden` _(boolean?=true)_ Skip attribute when formatting the returned item of a command:

```tsx
const pokemonName = string().hidden()
const pokemonName = string({ hidden: true })
```

- `key` _(boolean?=true)_ Tag attribute as needed to compute the primary key:

```tsx
// Note: The method will also modify the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const pokemonName = string().key()
const pokemonName = string({
  key: true,
  required: 'always'
})
```

- `savedAs` _(string)_ Previously known as `map`. Rename a root or Map sub-attribute before sending commands:

```tsx
const pokemonName = string().savedAs('_n')
const pokemonName = string({ savedAs: '_n' })
```

#### Looking forward

I’m planning on including new `null`, `tuple` and `allOf` attributes at some point.

If there are other types you’d like to see, feel free to leave a comment on this article and/or [open a discussion on the official repo](https://github.com/jeremydaly/dynamodb-toolbox) with the `v1` label 👍
