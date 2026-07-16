---
title: trim
sidebar_custom_props:
  code: true
---

# Trim

Trims a string attribute value:

```ts
import { trim } from 'dynamodb-toolbox/transformers/trim'

const prefixedSchema = string().transform(trim())

prefixer.encode(' foo ') // => 'foo'
// 👇 Does not re-inject the trimmed whitespaces
prefixer.decode('foo') // => 'foo'
// 👇 Does not trim when decoding
prefixer.decode(' bar ') // => ' bar '
```

You can [pipe](./6-pipe.md) a `string` transformer with the `.pipe(...)` method:

```ts
import { suffix } from 'dynamodb-toolbox/transformers/suffix'

const piped = trim().pipe(suffix('SUFFIX'))
const schema = string().transform(piped)
```
