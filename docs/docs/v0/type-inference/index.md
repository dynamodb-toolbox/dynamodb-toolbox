# Type Inference

Since the v0.4, most `Entity` methods types are inferred from an `Entity` definition. This is still experimental and may change in the future.

The following options are implemented:

- 🔑 `partitionKey`, `sortKey`: They are used, along with array-based mapped attributes to infer the primary key type.
- ⚡️ `autoExecute`, `execute`: If the `execute` option is set to `false` (either in the Entity definition or the method options), the method responses are typed as `DocumentClient.<METHOD>ItemInput`.
- 🧐 `autoParse`, `parse`: If the `parse` option is set to `false` (either in the Entity definition or the method options), the method responses are typed as `DocumentClient.<METHOD>ItemOutput`.
- ✍️ `typeAlias`, `createdAlias`, `modifiedAlias`: Aliases are used to compute the parsed responses types. They are also prevented from attribute definitions to avoid conflicts.
- ⏰ `timestamps`: If the `timestamps` option is set to false, `createdAlias` and `modifiedAlias` are omitted from the parsed responses types.
- 👮 `required`: Attributes flagged as `required` are required as needed in `put` and `update` operations. They appear as always defined in parsed responses. Attempting to remove them, either with the `$delete` shorthand or by setting them to `null` causes an error.
- 👍 `default`: Required attributes are not required in `put` and `update` operations if they have a `default` value. They appear as always defined in parsed responses.
- ✂️ `attributes`: In `get` and `queries` operations, the `attributes` option filter the attributes of the parsed responses types.
- ☝️ `conditions`: In `put`, `update` and `delete` operations, the `conditions` attributes are correctly typed.
- 📨 `returnValues`: In `put`, `update` and `delete` operation, the `returnValues` option is interpreted to format the responses.
- 🙈 `hidden`: Hidden attributes are omitted from the parsed responses types.
- 🔗 `dependsOn` option: If the `default` property of a key attribute is a function, you can use the `dependsOn` attribute to enable typing the primary key through the depended-on attributes (i.e. those used in the function).

The following options are not yet implemented:

- `alias` attribute option
- Table attributes!
- Secondary indexes names
- `coerce` option
- Improved `list` and `set` support
  ... And probably more! Feel free to open an issue if needed 🤗

## Overlays

When type infering doesn't cut it, every method supports the possibility of enforcing a custom `Item` type, and a custom `CompositeKey` type where needed.

```typescript
type CustomItem = {
  pk: string
  sk: string
  name: string
}

type CustomCompositeKey = {
  pk: string
  sk: string
}

const { Item } = await MyEntity.get<CustomItem, CustomCompositeKey>({
  pk: 'pk',
  sk: 'sk' // ✅ CustomCompositeKey expected
}) // ✅ Item is of type: undefined | CustomItem
```

Overlaying at the Entity level is also possible. The overlay is passed down to every method, and type inference is fully deactivated:

```typescript
const MyEntity =  new Entity<"MyEntityName", CustomItem, CustomCompositeKey, typeof table>({
  name: "MyEntityName",
  ...,
  table,
} as const)

await MyEntity.update({ pk, sk, name }) // ✅ Overlay CustomItem is used
await MyEntity.delete<CustomItem, { foo: "bar" }>({ foo: "bar" }) // ✅ Entity overlays can still be overridden
```

Write operations `condition` and read operations `attributes` options are also typed as the applied overlay keys and filter the response properties:

```typescript
const { Item } = await MyEntity.get({ pk, sk }, { attributes: ['incorrect'] }) // ❌ Errors
const { Item } = await MyEntity.get({ pk, sk }, { attributes: ['name'] }) // ✅ Item is of type { name: string }
```

## Utility Types

### EntityItem

The inferred or overlayed entity items type can be obtained through the `EntityItem` utility type:

```typescript
import type { EntityItem } from 'dynamodb-toolbox'

const listUsers = async (): Promise<EntityItem<typeof UserEntity>[]> => {
  const { Items } = await UserEntity.query(...)
  return Items
}
```

### Options

Sometimes, it can be useful to dynamically set an entity operation options. For instance:

```typescript
const queryOptions = {}

if (!isSuperadmin(user)) {
  queryOptions.beginsWith = 'USER'
}

const { Item } = await MyEntity.query(pk, { attributes: ['name', 'age'], ...queryOptions })
```

Sadly, in TS this throws an error, as `getOptions` is typed as `{}`. Using a non-generic `GetOptions` type also throws an error as the entity attribute names are hardly typed, and `string` is not assignable to the `attributes` or `conditions` options.

For this purpose, DynamoDB-Toolbox exposes `GetOptions`, `PutOptions`, `DeleteOptions`, `UpdateOptions` & `QueryOptions` utility types:

```typescript
import type { QueryOptions } from 'dynamodb-toolbox'

const queryOptions: QueryOptions<typeof MyEntity> = {}

if (!isSuperadmin(user)) {
  queryOptions.beginsWith = 'USER'
}

const { Item } = await MyEntity.query(pk, { attributes: ['name', 'age'], ...queryOptions })
```
