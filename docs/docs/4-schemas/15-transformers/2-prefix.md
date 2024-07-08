---
title: prefix
sidebar_custom_props:
  code: true
---

# Prefix

Prefixes a string attribute value:

```ts
import { prefix } from 'dynamodb-toolbox/transformers/prefix'

const prefixedSchema = string().transform(prefix('PREFIX'))
```

The default delimiter is `'#'`, but you can override it:

```ts
import { prefix } from 'dynamodb-toolbox/transformers/prefix'

const prefixedSchema = string().transform(
  prefix('PREFIX', { delimiter: '.' })
)
```
