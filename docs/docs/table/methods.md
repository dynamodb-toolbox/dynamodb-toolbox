# Table Methods

## query

#### query(partitionKey [,options] [,parameters])

> The Query operation finds items based on primary key values. You can query any table or secondary index that has a composite primary key (a partition key and a sort key).

The `query` method is a wrapper for the [DynamoDB Query API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html). The DynamoDB Toolbox `query` method supports all **Query** API operations. The `query` method returns a `Promise` and you must use `await` or `.then()` to retrieve the results. An alternative, synchronous method named `queryParams` can be used, but will only retrieve the generated parameters.

The `query()` method accepts three arguments. The first argument is used to specify the `partitionKey` you wish to query against (KeyConditionExpression). The value must match the type of your table's partition key.

The second argument is an `options` object that specifies the details of your query. The following options are all optional (corresponding Query API references in parentheses):

| Option     |        Type         | Description                                                                                                                                                                                                                                                                                      |
| ---------- | :-----------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| index      |      `string`       | Name of secondary index to query. If not specified, the query executes on the primary index. The index must include the table's `entityField` attribute for automatic parsing of returned data. (IndexName)                                                                                      |
| limit      |      `number`       | The maximum number of items to retrieve per query. (Limit)                                                                                                                                                                                                                                       |
| reverse    |      `boolean`      | Reverse the order or returned items. (ScanIndexForward)                                                                                                                                                                                                                                          |
| consistent |      `boolean`      | Enable a consistent read of the items (ConsistentRead)                                                                                                                                                                                                                                           |
| capacity   |      `string`       | Return the amount of consumed capacity. One of either `none`, `total`, or `indexes` (ReturnConsumedCapacity)                                                                                                                                                                                     |
| select     |      `string`       | The attributes to be returned in the result. One of either `all_attributes`, `all_projected_attributes`, `specific_attributes`, or `count` (Select)                                                                                                                                              |
| eq         |  same as `sortKey`  | Specifies `sortKey` condition to be _equal_ to supplied value. (KeyConditionExpression)                                                                                                                                                                                                          |
| lt         |  same as `sortKey`  | Specifies `sortKey` condition to be _less than_ supplied value. (KeyConditionExpression)                                                                                                                                                                                                         |
| lte        |  same as `sortKey`  | Specifies `sortKey` condition to be _less than or equal to_ supplied value. (KeyConditionExpression)                                                                                                                                                                                             |
| gt         |  same as `sortKey`  | Specifies `sortKey` condition to be _greater than_ supplied value. (KeyConditionExpression)                                                                                                                                                                                                      |
| gte        |  same as `sortKey`  | Specifies `sortKey` condition to be _greater than or equal to_ supplied value. (KeyConditionExpression)                                                                                                                                                                                          |
| between    |       `array`       | Specifies `sortKey` condition to be _between_ the supplied values. Array should have two values matching the `sortKey` type. (KeyConditionExpression)                                                                                                                                            |
| beginsWith |  same as `sortKey`  | Specifies `sortKey` condition to _begin with_ the supplied values. (KeyConditionExpression)                                                                                                                                                                                                      |
| filters    | `array` or `object` | A complex `object` or `array` of objects that specifies the query's filter condition. See [Filters and Conditions](/docs/filters-and-conditions). (FilterExpression)                                                                                                                             |
| attributes | `array` or `object` | An `array` or array of complex `objects` that specify which attributes should be returned. See [Projection Expression](/docs/projection-expressions) below (ProjectionExpression)                                                                                                                |
| startKey   |      `object`       | An object that contains the `partitionKey` and `sortKey` of the first item that this operation will evaluate (if you're querying a secondary index, the keys for the primary index will also need to be included in the object - see `LastEvaluatedKey` result for details). (ExclusiveStartKey) |
| entity     |      `string`       | The name of a table Entity to evaluate `filters` and `attributes` against.                                                                                                                                                                                                                       |
| execute    |      `boolean`      | Enables/disables automatic execution of the DocumentClient method (default: _inherited from Entity_)                                                                                                                                                                                             |
| parse      |      `boolean`      | Enables/disables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Entity_)                                                                                                                                                                    |

If you prefer to specify your own parameters, the optional third argument allows you to add custom parameters. [See Adding custom parameters and clauses](/docs/custom-parameters) for more information.

```typescript
const result = await MyTable.query(
  'user#12345', // partition key
  {
    limit: 50, // limit to 50 items
    beginsWith: 'order#', // select items where sort key begins with value
    reverse: true, // return items in descending order (newest first)
    capacity: 'indexes', // return the total capacity consumed by the indexes
    filters: { attr: 'total', gt: 100 }, // only show orders above $100
    index: 'GSI1' // query the GSI1 secondary index
  }
)
```

<h3>Return Data</h3>

The data is returned with the same response syntax as the [DynamoDB Query API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html). In TS, type inference is not applied. If `autoExecute` and `autoParse` are enabled, any `Items` data returned will be parsed into its corresponding Entity's aliases. Otherwise, the DocumentClient will return the unmarshalled data. If the response is parsed by the library, a `.next()` method will be available on the returned object. Calling this function will call the `query` method again using the same parameters and passing the `LastEvaluatedKey` in as the `ExclusiveStartKey`. This is a convenience method for paginating the results.

## scan

#### scan([options] [,parameters])

> The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index.

The `scan` method is a wrapper for the [DynamoDB Scan API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html). The DynamoDB Toolbox `scan` method supports all **Scan** API operations. The `scan` method returns a `Promise` and you must use `await` or `.then()` to retrieve the results. An alternative, synchronous method named `scanParams` can be used, but will only retrieve the generated parameters.

The `scan()` method accepts two arguments. The first argument is an `options` object that specifies the details of your scan. The following options are all optional (corresponding Scan API references in parentheses):

| Option     |        Type         | Description                                                                                                                                                                                                |
| ---------- | :-----------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| index      |      `string`       | Name of secondary index to scan. If not specified, the query executes on the primary index. The index must include the table's `entityField` attribute for automatic parsing of returned data. (IndexName) |
| limit      |      `number`       | The maximum number of items to retrieve per scan. (Limit)                                                                                                                                                  |
| consistent |      `boolean`      | Enable a consistent read of the items (ConsistentRead)                                                                                                                                                     |
| capacity   |      `string`       | Return the amount of consumed capacity. One of either `none`, `total`, or `indexes` (ReturnConsumedCapacity)                                                                                               |
| select     |      `string`       | The attributes to be returned in the result. One of either `all_attributes`, `all_projected_attributes`, `specific_attributes`, or `count` (Select)                                                        |
| filters    | `array` or `object` | A complex `object` or `array` of objects that specifies the scan's filter condition. See [Filters and Conditions](/docs/filters-and-conditions). (FilterExpression)                                        |
| attributes | `array` or `object` | An `array` or array of complex `objects` that specify which attributes should be returned. See [Projection Expression](/docs/projection-expressions) below (ProjectionExpression)                          |
| startKey   |      `object`       | An object that contains the `partitionKey` and `sortKey` of the first item that this operation will evaluate. (ExclusiveStartKey)                                                                          |
| segments   |      `number`       | For a parallel `scan` request, `segments` represents the total number of segments into which the `scan` operation will be divided. (TotalSegments)                                                         |
| segment    |      `number`       | For a parallel `scan` request, `segment` identifies an individual segment to be scanned by an application worker. (Segment)                                                                                |
| entity     |      `string`       | The name of a table Entity to evaluate `filters` and `attributes` against.                                                                                                                                 |
| execute    |      `boolean`      | Enables/disables automatic execution of the DocumentClient method (default: _inherited from Entity_)                                                                                                       |
| parse      |      `boolean`      | Enables/disables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Entity_)                                                                              |

If you prefer to specify your own parameters, the optional second argument allows you to add custom parameters. [See Adding custom parameters and clauses](/docs/custom-parameters) for more information.

```typescript
const result = await MyTable.scan({
  limit: 100, // limit to 50 items
  capacity: 'indexes', // return the total capacity consumed by the indexes
  filters: { attr: 'total', between: [100, 500] }, // only return orders between $100 and $500
  index: 'GSI1' // scan the GSI1 secondary index
})
```

<h3>Return Data</h3>

The data is returned with the same response syntax as the [DynamoDB Scan API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html). In TS, type inference is not applied. If `autoExecute` and `autoParse` are enabled, any `Items` data returned will be parsed into its corresponding Entity's aliases. Otherwise, the DocumentClient will return the unmarshalled data. If the response is parsed by the library, a `.next()` method will be available on the returned object. Calling this function will call the `scan` method again using the same parameters and passing the `LastEvaluatedKey` in as the `ExclusiveStartKey`. This is a convenience method for paginating the results.

## batchGet

#### batchGet(items [,options] [,parameters])

> The BatchGetItem operation returns the attributes of one or more items from one or more tables. You identify requested items by primary key.

The `batchGet` method is a wrapper for the [DynamoDB BatchGetItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html). The DynamoDB Toolbox `batchGet` method supports all **BatchGetItem** API operations. The `batchGet` method returns a `Promise` and you must use `await` or `.then()` to retrieve the results. An alternative, synchronous method named `batchGetParams` can be used, but will only retrieve the generated parameters.

The `batchGet` method accepts three arguments. The first is an `array` of item keys to get. The DynamoDB Toolbox provides the `getBatch` method on your entities to help you generate the proper key configuration. You can specify different entity types as well as entities from different tables, and this library will handle the proper payload construction.

The optional second argument accepts an `options` object. The following options are all optional (corresponding BatchGetItem API references in parentheses):

| Option     |               Type                | Description                                                                                                                                                                       |
| ---------- | :-------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| consistent | `boolean` or `object` (see below) | Enable a consistent read of the items (ConsistentRead)                                                                                                                            |
| capacity   |             `string`              | Return the amount of consumed capacity. One of either `none`, `total`, or `indexes` (ReturnConsumedCapacity)                                                                      |
| attributes |  `array` or `object` (see below)  | An `array` or array of complex `objects` that specify which attributes should be returned. See [Projection Expression](/docs/projection-expressions) below (ProjectionExpression) |
| execute    |             `boolean`             | Enables/disables automatic execution of the DocumentClient method (default: _inherited from Entity_)                                                                              |
| parse      |             `boolean`             | Enables/disables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Entity_)                                                     |

### Specifying options for multiple tables

The library is built for making working with single table designs easier, but it is possible that you may need to retrieve data from multiple tables within the same batch get. If your `items` contain references to multiple tables, the `consistent` option will accept objects that use either the table `name` or `alias` as the key, and the setting as the value. For example, to specify different `consistent` settings on two tables, you would use something like following:

```typescript
const results = await MyTable.batchGet(
  // ... ,
  {
    consistent: {
      'my-table-name': true,
      'my-other-table-name': false
    }
    // ...
  }
)
```

Setting either value without the `object` structure will set the option for all referenced tables. If you are referencing multiple tables and using the `attributes` option, then you must use the same `object` method to specify the table `name` or `alias`. The value should follow the standard [Projection Expression](/docs/projection-expressions) formatting.

```typescript
const results = await MyTable.batchGet(
  [
    MyTable.User.getBatch({ family: 'Brady', name: 'Mike' }),
    MyTable.User.getBatch({ family: 'Brady', name: 'Carol' }),
    MyTable.Pet.getBatch({ family: 'Brady', name: 'Tiger' })
  ],
  {
    capacity: 'total',
    attributes: [
        'name', 'family',
        { User: ['dob', 'age'] },
        { Pet: ['petType','lastVetCheck'] }
      ]
    }
  }
)
```

If you prefer to specify your own parameters, the optional third argument allows you to add custom parameters. [See Adding custom parameters and clauses](/docs/custom-parameters) for more information.

<h3>Return Data</h3>

The data is returned with the same response syntax as the [DynamoDB BatchGetItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html). In TS, type inference is not applied. If `autoExecute` and `autoParse` are enabled, any `Responses` data returned will be parsed into its corresponding Entity's aliases. Otherwise, the DocumentClient will return the unmarshalled data. If the response is parsed by the library, a `.next()` method will be available on the returned object. Calling this function will call the `batchGet` method again using the same options and passing any `UnprocessedKeys` in as the `RequestItems`. This is a convenience method for retrying unprocessed keys.

## batchWrite

#### batchWrite(items [,options] [,parameters])

> The BatchWriteItem operation puts or deletes multiple items in one or more tables. A single call to BatchWriteItem can write up to 16 MB of data, which can comprise as many as 25 put or delete requests.

The `batchWrite` method is a wrapper for the [DynamoDB BatchWriteItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html). The DynamoDB Toolbox `batchWrite` method supports all **BatchWriteItem** API operations. The `batchWrite` method returns a `Promise` and you must use `await` or `.then()` to retrieve the results. An alternative, synchronous method named `batchWriteParams` can be used, but will only retrieve the generated parameters.

The `batchWrite` method accepts three arguments. The first is an `array` of item keys to either `put` or `delete`. The DynamoDB Toolbox provides a `putBatch` and `deleteBatch` method on your entities to help you generate the proper key configuration for each item. You can specify different entity types as well as entities from different tables, and this library will handle the proper payload construction.

The optional second argument accepts an `options` object. The following options are all optional (corresponding BatchWriteItem API references in parentheses):

| Option   |               Type               | Description                                                                                                                                                                                                                                           |
| -------- | :------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capacity | `string` or `object` (see below) | Return the amount of consumed capacity. One of either `none`, `total`, or `indexes` (ReturnConsumedCapacity)                                                                                                                                          |
| metrics  |             `string`             | Return item collection metrics. If set to `size`, the response includes statistics about item collections, if any, that were modified during the operation are returned in the response. One of either `none` or `size` (ReturnItemCollectionMetrics) |
| execute  |            `boolean`             | Enables/disables automatic execution of the DocumentClient method (default: _inherited from Entity_)                                                                                                                                                  |
| parse    |            `boolean`             | Enables/disables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Entity_)                                                                                                                         |

**NOTE:** The `BatchWriteItem` does not support conditions or return deleted items. _"BatchWriteItem does not behave in the same way as individual PutItem and DeleteItem calls would. For example, you cannot specify conditions on individual put and delete requests, and BatchWriteItem does not return deleted items in the response."_ ~ [DynamoDB BatchWriteItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html)

```typescript
const result = await Default.batchWrite(
  [
    MyTable.User.putBatch({ family: 'Brady', name: 'Carol', age: 40, roles: ['mother', 'wife'] }),
    MyTable.User.putBatch({ family: 'Brady', name: 'Mike', age: 42, roles: ['father', 'husband'] }),
    MyTable.Pet.deleteBatch({ family: 'Brady', name: 'Tiger' })
  ],
  {
    capacity: 'total',
    metrics: 'size'
  }
)
```

If you prefer to specify your own parameters, the optional third argument allows you to add custom parameters. [See Adding custom parameters and clauses](/docs/custom-parameters) for more information.

<h3>Return Data</h3>

The data is returned with the same response syntax as the [DynamoDB BatchWriteItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html). If `autoExecute` and `autoParse` are enabled, a `.next()` method will be available on the returned object. Calling this function will call the `batchWrite` method again using the same options and passing any `UnprocessedItems` in as the `RequestItems`. This is a convenience method for retrying unprocessed keys.

## transactGet

#### transactGet(items [,options] [,parameters])

> TransactGetItems is a synchronous operation that atomically retrieves multiple items from one or more tables (but not from indexes) in a single account and Region.

The `transactGet` method is a wrapper for the [DynamoDB TransactGetItems API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html). The DynamoDB Toolbox `transactGet` method supports all **TransactGetItem** API operations. The `transactGet` method returns a `Promise` and you must use `await` or `.then()` to retrieve the results. An alternative, synchronous method named `transactGetParams` can be used, but will only retrieve the generated parameters.

The `transactGet` method accepts three arguments. The first is an `array` of item keys to get. The DynamoDB Toolbox provides the `getTransaction` method on your entities to help you generate the proper key configuration. You can specify different entity types as well as entities from different tables, and this library will handle the proper payload construction.

The optional second argument accepts an `options` object. The following options are all optional (corresponding TransactGetItems API references in parentheses):

| Option   |   Type    | Description                                                                                                                  |
| -------- | :-------: | ---------------------------------------------------------------------------------------------------------------------------- |
| capacity | `string`  | Return the amount of consumed capacity. One of either `none`, `total`, or `indexes` (ReturnConsumedCapacity)                 |
| execute  | `boolean` | Enables/disables automatic execution of the DocumentClient method (default: _inherited from Table_)                          |
| parse    | `boolean` | Enables/disables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Table_) |

### Accessing items from multiple tables

Transaction items are atomic, so each `Get` contains the table name and key necessary to retrieve the item. The library will automatically handle adding the necessary information and will parse each entity automatically for you.

```typescript
const results = await MyTable.transactGet(
  [
    User.getTransaction({ family: 'Brady', name: 'Mike' }),
    User.getTransaction({ family: 'Brady', name: 'Carol' }),
    Pet.getTransaction({ family: 'Brady', name: 'Tiger' })
  ],
  { capacity: 'total' }
)
```

If you prefer to specify your own parameters, the optional third argument allows you to add custom parameters. [See Adding custom parameters and clauses](/docs/custom-parameters) for more information.

<h3>Return Data</h3>

The data is returned with the same response syntax as the [DynamoDB TransactGetItems API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html). In TS, type inference is not applied. If `autoExecute` and `autoParse` are enabled, any `Responses` data returned will be parsed into its corresponding Entity's aliases. Otherwise, the DocumentClient will return the unmarshalled data.

## transactWrite

#### transactWrite(items [,options] [,parameters])

> TransactWriteItems is a synchronous write operation that groups up to 25 action requests. The actions are completed atomically so that either all of them succeed, or all of them fail.

The `transactWrite` method is a wrapper for the [DynamoDB TransactWriteItems API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html). The DynamoDB Toolbox `transactWrite` method supports all **TransactWriteItems** API operations. The `transactWrite` method returns a `Promise` and you must use `await` or `.then()` to retrieve the results. An alternative, synchronous method named `transactWriteParams` can be used, but will only retrieve the generated parameters.

The `transactWrite` method accepts three arguments. The first is an `array` of item keys to either `put`, `delete`, `update` or `conditionCheck`. The DynamoDB Toolbox provides `putTransaction`,`deleteTransaction`, `updateTransaction`, and `conditionCheck` methods on your entities to help you generate the proper configuration for each item. You can specify different entity types as well as entities from different tables, and this library will handle the proper payload construction.

The optional second argument accepts an `options` object. The following options are all optional (corresponding TransactWriteItems API references in parentheses):

| Option   |   Type    | Description                                                                                                                                                                                                                                           |
| -------- | :-------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capacity | `string`  | Return the amount of consumed capacity. One of either `none`, `total`, or `indexes` (ReturnConsumedCapacity)                                                                                                                                          |
| metrics  | `string`  | Return item collection metrics. If set to `size`, the response includes statistics about item collections, if any, that were modified during the operation are returned in the response. One of either `none` or `size` (ReturnItemCollectionMetrics) |
| token    | `string`  | Optional token to make the call idempotent, meaning that multiple identical calls have the same effect as one single call. (ClientRequestToken)                                                                                                       |
| execute  | `boolean` | Enables/disables automatic execution of the DocumentClient method (default: _inherited from Entity_)                                                                                                                                                  |
| parse    | `boolean` | Enables/disables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Entity_)                                                                                                                         |

```typescript
const result = await Default.transactWrite(
  [
    Pet.conditionCheck({ family: 'Brady', name: 'Tiger' }, { conditions: { attr: 'alive', eq: false } },
    Pet.deleteTransaction({ family: 'Brady', name: 'Tiger' }),
    User.putTransaction({ family: 'Brady', name: 'Carol', age: 40, roles: ['mother','wife'] }),
    User.putTransaction({ family: 'Brady', name: 'Mike', age: 42, roles: ['father','husband'] }),
    User.putTransaction({ family: 'Brady', name: 'Mike', age: 42, unmappedField: 'unmappedValue' }, { strictSchemaCheck: false})
  ],{
    capacity: 'total',
    metrics: 'size',
  }
)
```

If you prefer to specify your own parameters, the optional third argument allows you to add custom parameters. [See Adding custom parameters and clauses](/docs/custom-parameters) for more information.

<h3>Return Data</h3>

The data is returned with the same response syntax as the [DynamoDB TransactWriteItems API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html).

## Entity Convenience Methods

The following methods allow you to execute `Entity` methods directly from your `Table` instances. An `entity` must be specified as the first argument to allow the `Table` instance to determine the correct entity type.

### parse

#### parse(entity, input [,include])

Executes the `parse` method of the supplied `entity`. The `entity` must be a `string` that references the name of an Entity associated with the table. See the [Entity `parse` method](/docs/entity/methods#parse) for additional parameters and behavior. In TS, type inference is not applied.

### get

#### get(entity, key [,options] [,parameters])

Executes the `get` method of the supplied `entity`. The `entity` must be a `string` that references the name of an Entity associated with the table. See the [Entity `get` method](/docs/entity/methods#get) for additional parameters and behavior. In TS, type inference is not applied.

### delete

#### delete(entity, key [,options] [,parameters])

Executes the `delete` method of the supplied `entity`. The `entity` must be a `string` that references the name of an Entity associated with the table. See the [Entity `delete` method](/docs/entity/methods#delete) for additional parameters and behavior.

### put

#### put(entity, item [,options] [,parameters])

Executes the `put` method of the supplied `entity`. The `entity` must be a `string` that references the name of an Entity associated with the table. See the [Entity `put` method](/docs/entity/methods#put) for additional parameters and behavior.

### update

#### update(entity, key [,options] [,parameters])

Executes the `update` method of the supplied `entity`. The `entity` must be a `string` that references the name of an Entity associated with the table. See the [Entity `update` method](/docs/entity/methods#update) for additional parameters and behavior.
