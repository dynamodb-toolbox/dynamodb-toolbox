---
title: jsonStringify
sidebar_custom_props:
  code: true
---

# JSONStringify

Applies `JSON.stringify` to any value:

```ts
import { jsonStringify } from 'dynamodb-toolbox/transformers/jsonStringify'

const jsonStringifier = jsonStringify()
const stringifiedSchema = any().transform(jsonStringifier)

prefixer.encode({ foo: 'bar' }) // => '{"foo":"bar"}'
prefixer.decode('{"foo":"bar"}') // => { foo: 'bar' }
```

If needed, you can provide custom [`space`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#space), [`replacer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#replacer) and [`reviver`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#reviver) options:

```ts
import { jsonStringify } from 'dynamodb-toolbox/transformers/jsonStringify'

const priceJSONStringifier = jsonStringify({
  space: 2,
  // Save prices as cents
  replacer: (_, dollars) =>
    typeof dollars === 'number'
      ? Math.round(dollars * 100)
      : value,
  // Revive cents as dollars
  reviver: (_, cents) =>
    typeof cents === 'number' ? cents / 100 : cents
})
```

:::info

The `replacer` and `reviver` options are not serialized when building a [`DTO`](../17-actions/3-dto.md).

:::

You can [pipe](./5-pipe.md) a `string` transformer with the `.pipe(...)` method:

```ts
import { prefix } from 'dynamodb-toolbox/transformers/prefix'

const piped = jsonStringify().pipe(prefix('PREFIX'))
const schema = any().transform(piped)
```
