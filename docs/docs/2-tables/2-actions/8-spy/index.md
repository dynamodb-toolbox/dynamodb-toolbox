---
title: Spy
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# TableSpy

Enables [spying](https://en.wikipedia.org/wiki/Mock_object) the provided `Table`.

`TableSpy` is useful for writing **unit tests**, allowing you to stub sendable actions (e.g. [`Scans`](../1-scan/index.md) and [`Query`](../2-query/index.md)), mock their behavior, and inspect their call history:

```ts
import { TableSpy } from 'dynamodb-toolbox/table/actions/spy'

const tableSpy = PokeTable.build(TableSpy)

// 🙌 Type-safe!
tableSpy.on(ScanCommand).resolve({ Items: mockedItems })

const { Items } = await PokeTable.build(ScanCommand)
  .entities(PokemonEntity)
  .options({ consistent: true })
  .send()

expect(Items).toStrictEqual(mockedItems) // ✅

const scanCount = tableSpy.sent(ScanCommand).count()
expect(scanCount).toBe(1) // ✅

// Reset history
tableSpy.reset()

// Stop spying
tableSpy.restore()
```

:::note

Non-mocked actions are sent as usual.

:::

## Methods

### `on(...)`

<p style={{ marginTop: '-15px' }}><i><code>(Action: SENDABLE_ACTION) => Stub&lt;TABLE, SENDABLE_ACTION&gt;</code></i></p>

Enables stubbing a sendable action (see the [stub section](#stub-methods) section for more details):

```ts
import { ScanCommand } from 'dynamodb-toolbox/table/actions/scan'

const scanStub = tableSpy.on(ScanCommand)
```

### `sent(...)`

<p style={{ marginTop: '-15px' }}><i><code>(Action: SENDABLE_ACTION) => Inspector&lt;TABLE, SENDABLE_ACTION&gt;</code></i></p>

Enables inspecting a sendable action call history (see the [inspector section](#inspector-methods) section for more details):

```ts
import { ScanCommand } from 'dynamodb-toolbox/table/actions/scan'

const scanInspector = tableSpy.sent(ScanCommand)
```

### `reset()`

<p style={{ marginTop: '-15px' }}><i><code>() => Spy&lt;TABLE&gt;</code></i></p>

Reset the call history for all actions:

```ts
expect(scanInspector.count()).toBe(1) // ✅

tableSpy.reset()

expect(scanInspector.count()).toBe(0) // ✅

// The method returns the spy, so you can chain a new stub:
tableSpy.reset().on(ScanCommand).resolve({ Items: [...] })
```

### `restore()`

<p style={{ marginTop: '-15px' }}><i><code>() => void</code></i></p>

Stop spying the `Table` altogether:

```ts
// After this point, the spy is not able to intercept any action
tableSpy.restore()
```

## Stub Methods

### `resolve(...)`

<p style={{ marginTop: '-15px' }}><i><code>(responseMock: Response&lt;ACTION&gt;) => Spy&lt;TABLE&gt;</code></i></p>

Mocks the response of a sendable action `.send()` method:

```ts
// 🙌 Type-safe!
tableSpy.on(ScanCommand).resolve({ Items: mockedItems })

const { Items } = await PokeTable.build(ScanCommand).send()

expect(Items).toStrictEqual(mockedItems) // ✅
```

### `mock(...)`

<p style={{ marginTop: '-15px' }}><i><code>(mock: ((...args: Args&lt;ACTION&gt;) => Promisable&lt;Response&lt;ACTION&gt;&gt; | undefined)) => Spy&lt;TABLE&gt;</code></i></p>

Mocks the implementation of a sendable action `.send()` method (synchronously or asynchronously), enabling you to return dynamic responses:

```ts
// 🙌 Type-safe!
tableSpy.on(ScanCommand).mock((entities, options) => {
  if (
    entities.length === 1 &&
    entities[0] === PokemonEntity
  ) {
    return { Items: mockedPokemons }
  }
})

const { Items } = await PokeTable.build(ScanCommand)
  .entities(PokemonEntity)
  .send()

expect(Items).toStrictEqual(mockedPokemons) // ✅
```

:::info

Returning `undefined` is possible and lets the action proceed as usual.

:::

### `reject(...)`

<p style={{ marginTop: '-15px' }}><i><code>(error?: string | Error | AwsError) => Spy&lt;TABLE&gt;</code></i></p>

Simulates an error during the execution of a sendable action `.send()` method:

<Tabs>
<TabItem value="any" label="Any error">

```ts
tableSpy.on(ScanCommand).reject()

await expect(() =>
  PokeTable.build(ScanCommand).send()
).rejects.toThrow() // ✅
```

</TabItem>
<TabItem value="message" label="Message">

```ts
tableSpy.on(ScanCommand).reject('Fake error')

await expect(() =>
  PokeTable.build(ScanCommand).send()
).rejects.toThrow('Fake error') // ✅
```

</TabItem>
<TabItem value="getter" label="AWS Error">

```ts
tableSpy.on(ScanCommand).reject({
  Name: 'ServiceUnavailable',
  Code: '503',
  Message: 'Service is unable to handle request.',
  $fault: 'server',
  $service: 'DynamoDB'
})

await expect(() =>
  PokeTable.build(ScanCommand).send()
).rejects.toThrow({ Name: 'ServiceUnavailable' }) // ✅
```

</TabItem>
</Tabs>

:::info

Stub methods return the original spy, so you can easily chain them:

```ts
tableSpy
  .on(ScanCommand)
  .resolve({ Items: [...] })
  .on(QueryCommand)
  .reject('Some error')
```

:::

## Inspector methods

### `count()`

<p style={{ marginTop: '-15px' }}><i><code>() => number</code></i></p>

Returns the number of times the action was sent:

```ts
tableSpy.on(ScanCommand).resolve({ Items: mockedItems })

const { Items } = await PokeTable.build(ScanCommand).send()

const count = tableSpy.sent(ScanCommand).count()

expect(count).toBe(1) // ✅
```

### `allArgs()`

<p style={{ marginTop: '-15px' }}><i><code>() => Args&lt;ACTION&gt;[]</code></i></p>

Returns the arguments of the sendable action call history:

```ts
tableSpy.on(ScanCommand).resolve({})

await PokeTable.build(ScanCommand)
  .entities(PokemonEntity)
  .options({ consistent: true })
  .send()
await PokeTable.build(ScanCommand)
  .entities(TrainerEntity)
  .send()

const allArgs = tableSpy.sent(ScanCommand).allArgs()

expect(allArgs).toStrictEqual([
  // First call
  [PokemonEntity, { consistent: true }],
  // Second call
  [TrainerEntity, {}]
]) // ✅
```

### `args(...)`

<p style={{ marginTop: '-15px' }}><i><code>(index: number) => Args&lt;ACTION&gt;</code></i></p>

Returns the arguments of the n-th action of the call history:

```ts
tableSpy.on(ScanCommand).resolve({})

await PokeTable.build(ScanCommand)
  .entities(PokemonEntity)
  .options({ consistent: true })
  .send()
await PokeTable.build(ScanCommand)
  .entities(TrainerEntity)
  .send()

const firstArgs = tableSpy.sent(ScanCommand).args(0)

expect(firstArgs).toStrictEqual([
  PokemonEntity,
  { consistent: true }
]) // ✅
```

:::note

Note that the index is zero-based.

:::
