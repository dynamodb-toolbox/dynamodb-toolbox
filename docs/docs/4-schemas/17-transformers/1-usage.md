---
title: Usage
---

# Transformers

Transformers allow modifying a primitive attribute value during the [transformation step](../16-actions/1-parse.md):

```ts
import type { Transformer } from 'dynamodb-toolbox/transformers/prefix'

const PREFIX = 'POKEMON#'

const prefix: Transformer<string, string> = {
  // Updates the value during parsing
  parse: input => [PREFIX, input].join(''),
  // Updates the value back during formatting
  format: saved => saved.slice(PREFIX.length)
}

// Saves the prefixed value
const pokemonIdSchema = string().transform(prefix)
const pokemonIdSchema = string({ transform: prefix })
```

For the moment, there's only one available off-the-shelf transformer, but we hope there will be more in the future:

- [`prefix`](./2-prefix.md): Prefixes a string value

If you think of a transformer that you'd like to see open-sourced, feel free to open an issue or submit a PR 🤗
