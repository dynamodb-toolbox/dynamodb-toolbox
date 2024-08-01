---
title: Spy
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# EntitySpy

Enables [spying](https://en.wikipedia.org/wiki/Mock_object) the provided `Entity`.

`EntitySpy` is useful for writing **unit tests**, allowing you to stub sendable actions (e.g. [`GetItemCommand`](../1-get-item/index.md), [`PutItemCommand`](../2-put-item/index.md) etc.), mock their behavior, and inspect their call history:

```ts
import { EntitySpy } from 'dynamodb-toolbox/entity/actions/spy'

const entitySpy = PokemonEntity.build(EntitySpy)

// 🙌 Type-safe!
entitySpy.on(GetItemCommand).resolve({ Item: pokeMock })

const { Item } = await PokemonEntity.build(GetItemCommand)
  .key(key)
  .options({ consistent: true })
  .send()

expect(Item).toStrictEqual(pokeMock) // ✅

const getCount = entitySpy.sent(GetItemCommand).count()
expect(getCount).toBe(1) // ✅

// Reset history
entitySpy.reset()

// Stop spying
entitySpy.restore()
```

:::note

Non-mocked actions are sent as usual.

:::

## Methods

### `on(...)`

<p style={{ marginTop: '-15px' }}><i><code>(Action: SENDABLE_ACTION) => Stub&lt;ENTITY, SENDABLE_ACTION&gt;</code></i></p>

Enables stubbing a sendable action (see the [stub section](#stub-methods) section for more details):

```ts
import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'

const getStub = entitySpy.on(GetItemCommand)
```

### `sent(...)`

<p style={{ marginTop: '-15px' }}><i><code>(Action: SENDABLE_ACTION) => Inspector&lt;ENTITY, SENDABLE_ACTION&gt;</code></i></p>

Enables inspecting a sendable action call history (see the [inspector section](#inspector-methods) section for more details):

```ts
import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'

const getInspector = entitySpy.sent(GetItemCommand)
```

### `reset()`

<p style={{ marginTop: '-15px' }}><i><code>() => Spy&lt;ENTITY&gt;</code></i></p>

Reset the call history for all actions:

```ts
expect(getInspector.count()).toBe(1) // ✅

entitySpy.reset()

expect(getInspector.count()).toBe(0) // ✅

// The method returns the spy, so you can chain a new stub:
entitySpy.reset().on(GetItemCommand).resolve({ Item: ... })
```

### `restore()`

<p style={{ marginTop: '-15px' }}><i><code>() => void</code></i></p>

Stop spying the `Entity` altogether:

```ts
// After this point, the spy is not able to intercept any action
entitySpy.restore()
```

## Stub Methods

### `resolve(...)`

<p style={{ marginTop: '-15px' }}><i><code>(responseMock: Response&lt;ACTION&gt;) => Spy&lt;ENTITY&gt;</code></i></p>

Mocks the response of a sendable action `.send()` method:

```ts
// 🙌 Type-safe!
entitySpy.on(GetItemCommand).resolve({ Item: pokeMock })

const { Item } = await PokemonEntity.build(GetItemCommand)
  .key(key)
  .send()

expect(Item).toStrictEqual(pokeMock) // ✅
```

### `mock(...)`

<p style={{ marginTop: '-15px' }}><i><code>(mock: ((...args: Args&lt;ACTION&gt;) => Promisable&lt;Response&lt;ACTION&gt;&gt; | undefined)) => Spy&lt;ENTITY&gt;</code></i></p>

Mocks the implementation of a sendable action `.send()` method (synchronously or asynchronously), enabling you to return dynamic responses:

```ts
// 🙌 Type-safe!
entitySpy.on(GetItemCommand).mock((key, options) => {
  if (key.pokemonId === 'pikachu') {
    return { Item: pikachuMock }
  }
})

const { Item } = await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu' })
  .send()

expect(Item).toStrictEqual(pikachuMock) // ✅
```

:::info

Returning `undefined` is possible and lets the action proceed as usual.

:::

### `reject(...)`

<p style={{ marginTop: '-15px' }}><i><code>(error?: string | Error | AwsError) => Spy&lt;ENTITY&gt;</code></i></p>

Simulates an error during the execution of a sendable action `.send()` method:

<Tabs>
<TabItem value="any" label="Any error">

```ts
entitySpy.on(GetItemCommand).reject()

await expect(() =>
  PokemonEntity.build(GetItemCommand).key(key).send()
).rejects.toThrow() // ✅
```

</TabItem>
<TabItem value="message" label="Message">

```ts
entitySpy.on(GetItemCommand).reject('Fake error')

await expect(() =>
  PokemonEntity.build(GetItemCommand).key(key).send()
).rejects.toThrow('Fake error') // ✅
```

</TabItem>
<TabItem value="getter" label="AWS Error">

```ts
entitySpy.on(GetItemCommand).reject({
  Name: 'ServiceUnavailable',
  Code: '503',
  Message: 'Service is unable to handle request.',
  $fault: 'server',
  $service: 'DynamoDB'
})

await expect(() =>
  PokemonEntity.build(GetItemCommand).key(key).send()
).rejects.toThrow({ Name: 'ServiceUnavailable' }) // ✅
```

</TabItem>
</Tabs>

:::info

Stub methods return the original spy, so you can easily chain them:

```ts
entitySpy
  .on(GetItemCommand)
  .resolve({ Item: ... })
  .on(PutItemCommand)
  .reject('Some error')
```

:::

## Inspector methods

### `count()`

<p style={{ marginTop: '-15px' }}><i><code>() => number</code></i></p>

Returns the number of times the action was sent:

```ts
entitySpy.on(GetItemCommand).resolve({ Item: pokeMock })

const { Item } =
  await PokemonEntity.build(GetItemCommand).send()

const count = entitySpy.sent(GetItemCommand).count()

expect(count).toBe(1) // ✅
```

### `allArgs()`

<p style={{ marginTop: '-15px' }}><i><code>() => Args&lt;ACTION&gt;[]</code></i></p>

Returns the arguments of the sendable action call history:

```ts
entitySpy.on(GetItemCommand).resolve({})

await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu' })
  .options({ consistent: true })
  .send()
await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'charizard' })
  .send()

const allArgs = entitySpy.sent(GetItemCommand).allArgs()

expect(allArgs).toStrictEqual([
  // First call
  [{ pokemonId: 'pikachu' }, { consistent: true }],
  // Second call
  [{ pokemoneId: 'charizard' }, {}]
]) // ✅
```

### `args(...)`

<p style={{ marginTop: '-15px' }}><i><code>(index: number) => Args&lt;ACTION&gt;</code></i></p>

Returns the arguments of the n-th action of the call history:

```ts
entitySpy.on(GetItemCommand).resolve({})

await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu' })
  .options({ consistent: true })
  .send()
await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'charizard' })
  .send()

const firstArgs = entitySpy.sent(GetItemCommand).args(0)

expect(firstArgs).toStrictEqual([
  { pokemonId: 'pikachu' },
  { consistent: true }
]) // ✅
```

:::note

Note that the index is zero-based.

:::
