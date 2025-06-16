---
title: pipe
sidebar_custom_props:
  code: true
  new: true
---

# Pipe

Merge multiple transformers into a single transformer:

```ts
import { pipe } from 'dynamodb-toolbox/transformers/pipe'
import { prefix } from 'dynamodb-toolbox/transformers/prefix'
import { suffix } from 'dynamodb-toolbox/transformers/suffix'

const piped = pipe(prefix('PREFIX'), suffix('SUFFIX'))
const schema = string().transform(piped)

prefixer.encode('foo') // => 'PREFIX#foo'
prefixer.decode('PREFIX#bar') // => 'bar'
```

:::info

Piped `encoders` are applied from left to right (and `decoders` from right to left):

```ts
const piped = pipe(prefix('lo'), prefix('yo'))

piped.encode('swag') // => 'yo#lo#swag'
piped.decode('yo#lo#swag') // => 'swag'
```

:::

Eventhough `pipe` is exposed, we recommend using the official `.pipe(...)` methods of each off-the-shelf transformer (including this one) for improved type-safety:

```ts
const prefixer = prefix('PREFIX')

const addOne: Transformer<number> = {
  encode: decoded => decoded + 1,
  decode: encoded => encoded - 1
}

// 🙅‍♂️ NOT type-safe
const notTypeSafe = pipe(prefixer, addOne)

// 💥 Raises a type error 👍
const typeSafe = prefix('PREFIX').pipe(addOne)
```

You can [pipe](./5-pipe.md) any transformer matching the end of the current pipe with the `.pipe(...)` method:

```ts
const transformer = jsonStringify()
  .pipe(prefix('PREFIX'))
  .pipe(suffix('SUFFIX'))

transformer.encode({ foo: 'bar' }) // => 'PREFIX#{"foo":"bar"}#SUFFIX'
```
