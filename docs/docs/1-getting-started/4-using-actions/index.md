---
title: Actions
---

# Using Actions

You might be surprised that classes barely have methods associated.

For instance, here is an example of a `GetItem` operation with the v0:

```ts
const { Item } = await PokemonEntity.get(key)
```

Instead, only have a `.build` method that is [3 lines long](TODO). Is a gateway to perform [actions](#actions-).

Action replace methods. Commands are instances of actions, synchronous actions, e.g. for Parsing and Formatting.

```ts
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key(key)
  .send()
```

Although it is slightly more verbose, ensures, light-weight, better code splitting, (typically, UpdateCommands code can be quite long) while keeping the same entity-oriented syntax. Bundles light-weight (and faster cold starts in the context of Serverless applications).

Exported through the `entryPoint` in `package.json`.

```ts
import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'

const { Item } = await PokemonEntity.build(GetItemCommand)
  .key(key)
  .send()
```

Tables, Entities and Schemas all have dedicated actions exposed in the same way.

## Actions? 🤔

An action is essentially a class that accepts a `Table`, `Entity` or `Schema` as the first parameter of its constructor, with all other parameters being optional.

Here's a simple example of an `NameGatter` action that... gets the name of an entity:

```ts
import {
  Entity,
  EntityAction,
  $entity
} from 'dynamodb-toolbox/entity'

export class NameGetter<
  ENTITY extends Entity = Entity
> extends EntityAction<ENTITY> {
  constructor(entity: ENTITY) {
    super(entity)
  }

  run(): ENTITY['name'] {
    return this[$entity].name
  }
}

const nameGetter = PokemonEntity.build(NameGetter)
// => NameGetter<typeof PokemonEntity>
const pokemonEntityName = nameGetter.run()
// => "POKEMON"
```

As you see, the `.build` methods simply instanciate a new action with its parent as first constructor parameter. Another way to do it would be:

```ts
const nameGetter = new NameGetter(PokemonEntity)
```

Less entity-oriented and (we find) less readable, but it leads to exactly the same result. In most actions, it actually saves a little less compute and memory usage, so feel free to use it if you prefer 🙌

Here's an example with the [`GetItemCommand` action](/docs/entities/actions/get-item):

```ts
// 👇 Entity-oriented
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .options({ consistent: true })
  .send()

// 👇 Action-oriented
const { Item } = await new GetItemCommand(
  PokemonEntity,
  { pokemonId: 'pikachu1' },
  { consistent: true }
).send()
```
