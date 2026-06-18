---
title: prefix
sidebar_custom_props:
  code: true
---

# Prefix

Prefixes a string attribute value:

```ts
import { prefix } from 'dynamodb-toolbox/transformers/prefix'

const prefixer = prefix('PREFIX')
const prefixedSchema = string().transform(prefixer)

prefixer.encode('foo') // => 'PREFIX#foo'
prefixer.decode('PREFIX#bar') // => 'bar'
// 👇 Passthrough if prefix is missing
prefixer.decode('bar') // => 'bar'
```

The default delimiter is `#`, but you can override it:

```ts
const prefixer = prefix('PREFIX', { delimiter: '/' })

prefixer.encode('foo') // => 'PREFIX/foo'
```

You can [pipe](./5-pipe.md) a `string` transformer with the `.pipe(...)` method:

```ts
import { suffix } from 'dynamodb-toolbox/transformers/suffix'

const piped = prefix('PREFIX').pipe(suffix('SUFFIX'))
const schema = string().transform(piped)
```
