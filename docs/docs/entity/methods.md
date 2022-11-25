# Entity Methods

## attribute

#### attribute(attribute)

Returns the Table's attribute name for the supplied `attribute`. The `attribute` must be a `string` and can be either a valid attribute name or alias.

## parse

#### parse(input [,include])

Parses attributes returned from a DynamoDB action and unmarshalls them into entity aliases. The `input` argument accepts an `object` with attributes as keys, an `array` of `objects` with attributes as keys, or an `object` with either an `Item` or `Items` property. This method will return a result of the same type of `input`. For example, if you supply an `array` of objects, an `array` will be returned. If you supply an object with an `Item` property, an `object` will be returned.

You can also pass in an `array` of strings as the second argument. The unmarshalling will only return the attributes (or aliases) specified in this `include` array.

If auto execute and auto parsing are enabled, data returned from a DynamoDB action will automatically be parsed.

<!-- TODO: Add code example -->

## get

#### get(key [,options] [,parameters])

> The GetItem operation returns a set of attributes for the item with the given primary key.

The `get` method is a wrapper for the [DynamoDB GetItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html). The DynamoDB Toolbox `get` method supports all **GetItem** API operations. The `get` method returns a `Promise` and you must use `await` or `.then()` to retrieve the results. An alternative, synchronous method named `getParams` can be used, but will only retrieve the generated parameters.

The `get` method accepts three arguments. The first argument accepts an `object` that is used to specify the primary key of the item you wish to "get" (Key). The `object` must contain keys for the attributes that represent your `partitionKey` and `sortKey` (if a compound key) with their values as the key values. For example, if `user_id` represents your `partitionKey`, and `status` represents your `sortKey`, to retrieve user_id "123" with a status of "active", you would specify `{ user_id: 123, status: 'active' }` as your `key`.

The optional second argument accepts an `options` object. The following options are all optional (corresponding GetItem API references in parentheses):

| Option     |        Type         | Description                                                                                                                                                                       |
| ---------- | :-----------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| consistent |      `boolean`      | Enable a consistent read of the items (ConsistentRead)                                                                                                                            |
| capacity   |      `string`       | Return the amount of consumed capacity. One of either `none`, `total`, or `indexes` (ReturnConsumedCapacity)                                                                      |
| attributes | `array` or `object` | An `array` or array of complex `objects` that specify which attributes should be returned. See [Projection Expression](/docs/projection-expressions) below (ProjectionExpression) |
| execute    |      `boolean`      | Enables/disables automatic execution of the DocumentClient method (default: _inherited from Entity_)                                                                              |
| parse      |      `boolean`      | Enables/disables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Entity_)                                                     |

If you prefer to specify your own parameters, the optional third argument allows you to add custom parameters. [See Adding custom parameters and clauses](/docs/custom-parameters) for more information.

```typescript
const { Item } = await MyEntity.get({
  pk: 123,
  sk: 'sort-key'
})
```

In TS, the primary key, `attributes` option and response types are dynamically inferred. See [Type Inference](/docs/type-inference) for more details.

## delete

#### delete(key [,options] [,parameters])

> Deletes a single item in a table by primary key.

The `delete` method is a wrapper for the [DynamoDB DeleteItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html). The DynamoDB Toolbox `delete` method supports all **DeleteItem** API operations. The `delete` method returns a `Promise` and you must use `await` or `.then()` to retrieve the results. An alternative, synchronous method named `deleteParams` can be used, but will only retrieve the generated parameters.

The `delete` method accepts three arguments. The first argument accepts an `object` that is used to specify the primary key of the item you wish to "delete" (Key). For example: `{ user_id: 123, status: 'active' }`

The optional second argument accepts an `options` object. The following options are all optional (corresponding DeleteItem API references in parentheses):

| Option       |        Type         | Description                                                                                                                                                                                                                                           |
| ------------ | :-----------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| conditions   | `array` or `object` | A complex `object` or `array` of objects that specifies the conditions that must be met to delete the item. See [Filters and Conditions](/docs/filters-and-conditions). (ConditionExpression)                                                         |
| capacity     |      `string`       | Return the amount of consumed capacity. One of either `none`, `total`, or `indexes` (ReturnConsumedCapacity)                                                                                                                                          |
| metrics      |      `string`       | Return item collection metrics. If set to `size`, the response includes statistics about item collections, if any, that were modified during the operation are returned in the response. One of either `none` or `size` (ReturnItemCollectionMetrics) |
| returnValues |      `string`       | Determines whether to return item attributes as they appeared before they were deleted. One of either `none` or `all_old`. (ReturnValues)                                                                                                             |
| execute      |      `boolean`      | Enables/disables automatic execution of the DocumentClient method (default: _inherited from Entity_)                                                                                                                                                  |
| parse        |      `boolean`      | Enables/disables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Entity_)                                                                                                                         |

If you prefer to specify your own parameters, the optional third argument allows you to add custom parameters. [See Adding custom parameters and clauses](/docs/custom-parameters) for more information.

```typescript
await MyEntity.delete(
  { pk: 123, sk: 'sort-key' },
  {
    conditions: { attr: 'date_modified' lt: '2020-01-01' },
    returnValues: 'all_old'
  }
)
```

In TS, the primary key, `conditions` option and response types are dynamically inferred. See [Type Inference](/docs/type-inference) for more details.

## put

#### put(item [,options] [,parameters])

> Creates a new item, or replaces an old item with a new item. If an item that has the same primary key as the new item already exists in the specified table, the new item completely replaces the existing item.

The `put` method is a wrapper for the [DynamoDB PutItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html). The DynamoDB Toolbox `put` method supports all **PutItem** API operations. The `put` method returns a `Promise` and you must use `await` or `.then()` to retrieve the results. An alternative, synchronous method named `putParams` can be used, but will only retrieve the generated parameters.

The `put` method accepts three arguments. The first argument accepts an `object` that represents the item to add to the DynamoDB table. The item can use attribute names or aliases and will convert the object into the appropriate shape defined by your Entity.

The optional second argument accepts an `options` object. The following options are all optional (corresponding PutItem API references in parentheses):

| Option       |        Type         | Description                                                                                                                                                                                                                                           |
| ------------ | :-----------------: |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| conditions   | `array` or `object` | A complex `object` or `array` of objects that specifies the conditions that must be met to put the item. See [Filters and Conditions](/docs/filters-and-conditions). (ConditionExpression)                                                            |
| capacity     |      `string`       | Return the amount of consumed capacity. One of either `none`, `total`, or `indexes` (ReturnConsumedCapacity)                                                                                                                                          |
| metrics      |      `string`       | Return item collection metrics. If set to `size`, the response includes statistics about item collections, if any, that were modified during the operation are returned in the response. One of either `none` or `size` (ReturnItemCollectionMetrics) |
| returnValues |      `string`       | Determines whether to return item attributes as they appeared before a new item was added. One of either `none` or `all_old`. (ReturnValues)                                                                                                          |
| execute      |      `boolean`      | Enables/disables automatic execution of the DocumentClient method (default: _inherited from Entity_)                                                                                                                                                  |
| parse        |      `boolean`      | Enables/disables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Entity_)                                                                                                                         |
| strictSchemaCheck |  `boolean`       | Determines whether to throw an error or filter returned attributes when unmapped fields are provided in the request                                                                                                                                                                |
If you prefer to specify your own parameters, the optional third argument allows you to add custom parameters. [See Adding custom parameters and clauses](/docs/custom-parameters) for more information.

```typescript
await MyEntity.put({
  id: 123,
  name: 'Jane Smith',
  company: 'ACME',
  age: 35,
  status: 'active',
  date_added: '2020-04-24'
})
```

In TS, the input item, `conditions` option and response types are dynamically inferred. See [Type Inference](/docs/type-inference) for more details.

## update

#### update(key [,options] [,parameters])

> Edits an existing item's attributes, or adds a new item to the table if it does not already exist. You can put, delete, or add attribute values.

The `update` method is a wrapper for the [DynamoDB UpdateItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html). The DynamoDB Toolbox `update` method supports all **UpdateItem** API operations. The `update` method returns a `Promise` and you must use `await` or `.then()` to retrieve the results. An alternative, synchronous method named `updateParams` can be used, but will only retrieve the generated parameters.

The `update` method accepts three arguments. The first argument accepts an `object` that represents the item key and attributes to be updated. The item can use attribute names or aliases and will convert the object into the appropriate shape defined by your Entity.

The optional second argument accepts an `options` object. The following options are all optional (corresponding UpdateItem API references in parentheses):

| Option       |        Type         | Description                                                                                                                                                                                                                                           |
| ------------ | :-----------------: |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| conditions   | `array` or `object` | A complex `object` or `array` of objects that specifies the conditions that must be met to update the item. See [Filters and Conditions](/docs/filters-and-conditions). (ConditionExpression)                                                         |
| capacity     |      `string`       | Return the amount of consumed capacity. One of either `none`, `total`, or `indexes` (ReturnConsumedCapacity)                                                                                                                                          |
| metrics      |      `string`       | Return item collection metrics. If set to `size`, the response includes statistics about item collections, if any, that were modified during the operation are returned in the response. One of either `none` or `size` (ReturnItemCollectionMetrics) |
| returnValues |      `string`       | Determines whether to return item attributes as they appeared before or after the item was updated. One of either `none`, `all_old`, `updated_old`, `all_new`, `updated_new`. (ReturnValues)                                                          |
| execute      |      `boolean`      | Enables/disables automatic execution of the DocumentClient method (default: _inherited from Entity_)                                                                                                                                                  |
| parse        |      `boolean`      | Enables/disables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Entity_)                                                                                                                         |
| strictSchemaCheck |  `boolean`       | Determines whether to throw an error or filter returned attributes when unmapped fields are provided in the request                                                                                                                                                                |

If you prefer to specify your own parameters, the optional third argument allows you to add custom parameters and clauses. [See Adding custom parameters and clauses](/docs/custom-parameters) for more information.

**But wait, there's more!** The `UpdateExpression` lets you do all kinds of crazy things like `REMOVE` attributes, `ADD` values to numbers and sets, and manipulate arrays. The DynamoDB Toolbox has simple ways to deal with all these different operations by properly formatting your input data.

### Updating an attribute

To update an attribute, include the key and any fields that you want to update.

```typescript
await MyEntity.update({
  pk: 123,
  sk: 'abc',
  status: 'inactive'
})
```

In TS, the input item, `conditions` option and response types are dynamically inferred. See [Type Inference](/docs/type-inference) for more details.

### Removing an attribute

To remove attributes, add a `$remove` key to your item and provide an array of attributes or aliases to remove.

```typescript
await MyEntity.update({
  //  ...
  $remove: ['roles', 'age']
})
```

### Adding a number to a `number` attribute

DynamoDB lets us add (or subtract) numeric values from an attribute in the table. If no value exists, it simply puts the value. Adding with the DynamoDB Toolbox is just a matter of supplying an `object` with an `$add` key on the number fields you want to update.

```typescript
await MyEntity.update({
  //  ...
  level: { $add: 2 } // add 2 to level
})
```

### Adding values to a `set`

Sets are similar to lists, but they enforce unique values of the same type. To add new values to a set, use an `object` with an `$add` key and an array of values.

```typescript
await MyEntity.update({
  //  ...
  roles: { $add: ['author', 'support'] }
})
```

### Deleting values from a `set`

To delete values from a `set`, use an `object` with a `$delete` key and an array of values to delete.

```typescript
await MyEntity.update({
  //  ...
  roles: { $delete: ['admin'] }
})
```

### Appending (or prepending) values to a `list`

To append values to a `list`, use an `object` with an `$append` key and an array of values to append.

```typescript
await MyEntity.update({
  //  ...
  sessions: { $append: [{ date: '2020-04-24', duration: 101 }] }
})
```

Alternatively, you can use the `$prepend` key and it will add the values to the beginning of the list.

### Remove items from a `list`

To remove values from a `list`, use an `object` with a `$remove` key and an array of **indexes** to remove. Lists are indexed starting at `0`, so the update below would remove the second, fifth, and sixth item in the array.

```typescript
await MyEntity.update({
  //  ...
  sessions: { $remove: [1, 4, 5] }
})
```

### Update items in a `list`

To update values in a `list`, specify an `object` with array indexes as the keys and the update data as the values. Lists are indexed starting at `0`, so the update below would update the second and fourth items in the array.

```typescript
await MyEntity.update({
  //  ...
  sessions: {
    1: 'some new value for the second item',
    3: 'new value for the fourth value'
  }
})
```

### Update nested data in a `map`

Maps can be complex, deeply nested JavaScript objects with a variety of data types. The DynamoDB Toolbox doesn't support schemas for `map`s (yet), but you can still manipulate them by wrapping your updates in a `$set` parameter and using dot notation and array index notation to target fields.

```typescript
await MyEntity.update({
  //  ...
  metadata: {
    $set: {
      title: 'Developer', // update metadata.title
      'contact.name': 'Jane Smith', // update metadata.contact.name
      'contact.addresses[0]': '123 Main Street' // update the first array item in metadata.contact.addresses
    }
  }
})
```

We can also use our handy `$add`, `$append`, `$prepend`, and `$remove` properties to manipulate nested values.

```typescript
await MyEntity.update({
  //  ...
  metadata: {
    $set: {
      vacation_days: { $add: -2 },
      'contact.addresses': { $append: ['99 South Street'] },
      'contact.phone': { $remove: [1, 3] }
    }
  }
})
```

## query

#### query(partitionKey [,options] [,parameters])

Executes the `query` method on the parent Table. This method accepts the same parameters as the [Table `query` method](/docs/table/methods#query) and automatically sets the `entity` option to the current entity. Due to the nature of DynamoDB queries, this method **does not** guarantee that only items of the current entity type will be returned.

In TS, the `attributes` option and response types are dynamically inferred. See [Type Inference](/docs/type-inference) for more details.

## scan

#### scan([options] [,parameters])

Executes the `scan` method on the parent Table. This method accepts the same parameters as the [Table `scan` method](/docs/table/methods#scan) and automatically sets the `entity` option to the current entity. Due to the nature of DynamoDB scans, this method **does not** guarantee that only items of the current entity type will be returned.

In TS, the `attributes` option and response types are dynamically inferred. See [Type Inference](/docs/type-inference) for more details.


## setTable

Assigns a Table instance to the entity. This method is called automatically when you use the `Entity` constructor.

This method returns the entity instance with the new type definitions.
You must use the returned value to get the correct type definitions because TypeScript is statically typed.

```typescript
const MyTable = new Table({
  name: 'MyTable',
  partitionKey: 'pk',
  sortKey: 'sk'
})

const MyEntity = new Entity({
  name: 'MyEntity',
  attributes: {
    pk: { partitionKey: true },
    sk: { sortKey: true }
  },
  table: MyTable
})

const myNewTable = new Table({
  name: 'MyNewTable',
  partitionKey: 'pk',
  sortKey: 'sk'
} as const)

const myNewEntity = MyEntity.setTable(MyNewTable)
```
