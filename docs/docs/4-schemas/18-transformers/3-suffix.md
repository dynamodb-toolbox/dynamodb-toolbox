---
title: suffix
sidebar_custom_props:
  code: true
  new: true
---

# Suffix

Suffixes a string attribute value:

```ts
import { suffix } from 'dynamodb-toolbox/transformers/suffix'

const suffixer = suffix('SUFFIX')
const suffixedSchema = string().transform(suffixer)

suffixer.encode('foo') // => 'foo#SUFFIX'
suffixer.decode('bar#SUFFIX') // => 'bar'
// 👇 Passthrough if suffix is missing
suffixer.decode('bar') // => 'bar'
```

The default delimiter is `#`, but you can override it:

```ts
const suffixer = suffix('SUFFIX', { delimiter: '/' })

suffixer.encode('foo') // => 'foo/SUFFIX'
```

You can [pipe](./5-pipe.md) a `string` transformer with the `.pipe(...)` method:

```ts
import { prefix } from 'dynamodb-toolbox/transformers/prefix'

const piped = suffix('SUFFIX').pipe(prefix('PREFIX'))
const schema = string().transform(piped)
```
