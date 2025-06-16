---
title: Usage
---

# Transformers

Transformers allow modifying a primitive ([`string`](../9-string/index.md), [`number`](../8-number/index.md) etc.) or [`any`](../5-any/index.md) attribute value during the [transformation step](../17-actions/1-parse.md):

```ts
const PREFIX = 'POKEMON#'

const prefix = {
  // Updates the value during parsing
  encode: (input: string) => [PREFIX, input].join(''),
  // Updates the value back during formatting
  decode: (saved: string) => saved.slice(PREFIX.length)
}

// Saves the prefixed value
const pokemonIdSchema = string().transform(prefix)
const pokemonIdSchema = string({ transform: prefix })
```

Some transformers are available off-the-shelf:

- [`prefix`](./2-prefix.md): Prefixes a `string` value
- [`suffix`](./3-suffix.md): Suffixes a `string` value
- [`jsonStringify`](./4-json-stringify.md): Applies `JSON.stringify` to any value
- [`pipe`](./5-pipe.md): Merge multiple transformers into a single transformer

When applicable, **we strongly recommend using those** instead of custom transformers as they are **type-safe** (using [`hotscript`](https://github.com/gvergnaud/hotscript)), [**serializable**](../17-actions/3-dto.md) and **chainable** using the `pipe(...)` method:

```ts
const transformer = jsonStringify()
  .pipe(prefix('PREFIX'))
  .pipe(suffix('SUFFIX'))

transformer.encode({ foo: 'bar' }) // => 'PREFIX#{"foo":"bar"}#SUFFIX'
```

:::note

If you need a new transformer, feel free to [open an issue](https://github.com/dynamodb-toolbox/dynamodb-toolbox/issues) or [submit a PR](https://github.com/dynamodb-toolbox/dynamodb-toolbox/pulls) 🤗

:::
