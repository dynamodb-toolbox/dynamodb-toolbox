---
title: jsonStringify
sidebar_custom_props:
  code: true
---

# JSONStringify

Applies `JSON.stringify` to any value:

```ts
import { jsonStringify } from 'dynamodb-toolbox/transformers/jsonStringify'

const stringifiedSchema = any().transform(jsonStringify())
```

If needed, you can provide custom [`space`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#space), [`replacer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#replacer) and [`reviver`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#reviver) options:

```ts
import { jsonStringify } from 'dynamodb-toolbox/transformers/jsonStringify'

const stringifiedSchema = any().transform(
  jsonStringify({
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
)
```
