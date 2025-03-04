---
title: Usage
---

# Transformers

Transformers allow modifying a primitive or `any` attribute value during the [transformation step](../16-actions/1-parse.md):

```ts
const PREFIX = 'POKEMON#'

const prefix = {
  // Updates the value during parsing
  parse: (input: string) => [PREFIX, input].join(''),
  // Updates the value back during formatting
  format: (saved: string) => saved.slice(PREFIX.length)
}

// Saves the prefixed value
const pokemonIdSchema = string().transform(prefix)
const pokemonIdSchema = string({ transform: prefix })
```

For the moment, there's only two available off-the-shelf transformers, but we hope there will be more in the future:

- [`prefix`](./2-prefix.md): Prefixes a `string` value
- [`jsonStringify`](./3-json-stringify.md): Applies `JSON.stringify` to any value

If you think of a transformer that you'd like to see open-sourced, feel free to open an issue or submit a PR 🤗
