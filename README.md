# DynamoDB Toolbox

[![Build Status](https://travis-ci.org/jeremydaly/dynamodb-toolbox.svg?branch=master)](https://travis-ci.org/jeremydaly/dynamodb-toolbox)
[![npm](https://img.shields.io/npm/v/dynamodb-toolbox.svg)](https://www.npmjs.com/package/dynamodb-toolbox)
[![npm](https://img.shields.io/npm/l/dynamodb-toolbox.svg)](https://www.npmjs.com/package/dynamodb-toolbox)
[![Coverage Status](https://coveralls.io/repos/github/jeremydaly/dynamodb-toolbox/badge.svg?branch=master)](https://coveralls.io/github/jeremydaly/dynamodb-toolbox?branch=master)

![dynamodb-toolbox](https://user-images.githubusercontent.com/2053544/69847647-b7910780-1245-11ea-8403-a35a0158f3aa.png)

### **NOTE:** This project is in BETA. Please submit [issues/feedback](https://github.com/jeremydaly/dynamodb-toolbox/issues) or feel free to contact me on Twitter [@jeremy_daly](https://twitter.com/jeremy_daly).

The **DynamoDB Toolbox** is a simple set of tools for working with [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) and the [DocumentClient](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html). It lets you define your data models (with typings and aliases) and map them to your DynamoDB table. You can then **generate parameters** to `put`, `get`, `delete`, and `update` data by passing in a JavaScript object. The DynamoDB Toolbox will map aliases, validate and coerce types, and even write complex `UpdateExpression`s for you. 😉

### This is *NOT* an ORM (at least I hope it's not)
There are several really good Object-Relational Mapping tools (ORMs) out there for DynamoDB. There's the [Amazon DynamoDB DataMapper For JavaScript](https://github.com/awslabs/dynamodb-data-mapper-js), [@Awspilot's DynamoDB](https://awspilot.dev/) project, [@baseprime's dynamodb](https://github.com/baseprime/dynamodb) package, and many more.

If you like working with ORMs, that's great, and you should definitely give these projects a look. But personally, I really dislike ORMs (especially ones for relational databases). I typically find them cumbersome and likely to generate terribly inefficient queries (you know who you are). So this project is not an ORM, or at least it's not trying to be. You still need to use the DocumentClient directly, handle transactions and failures, and deal with things like `ConditionExpression`s, `ProjectionExpressions`, and `ConsistentRead`s. But this library will (hopefully) make the vast majority of your DynamoDB interactions super simple, and maybe even a little bit fun! 😎

## Features
- **Table Schemas and DynamoDB Typings:** Define your data model using a simple JavaScript object structure, assign DynamoDB data types, and optionally set defaults.
- **Magic UpdateExpressions:** Writing complex `UpdateExpression` strings is a major pain, especially if the input data changes the underlying clauses or requires dynamic (or nested) attributes. This library handles everything from simple `SET` clauses, to complex `list` and `set` manipulations, to defaulting values with smartly applied `if_not_exists()` to avoid overwriting data.
- **Bidirectional Aliasing:** When building single table data models, you can define multiple schemas that map to the same table. Each schema can reuse fields (like `pk`,`sk`, and `data`) and map them to different aliases depending on the record type. Your data is automatically mapped correctly when reading and writing data.
- **Composite Key Generation and Field Mapping:** Doing some fancy data modeling with composite keys? Like setting your `sortKey` to `[country]#[region]#[state]#[county]#[city]#[neighborhood]` model hierarchies? DynamoDB Toolbox lets you map data to these composite keys which will both autogenerate the value *and* parse them into fields for you.
- **Type Coercion and Validation:** Automatically coerce values to strings, numbers and booleans to ensure consistent data types in your DynamoDB tables. Validate `list`, `map`, and `set` types against your data. Oh yeah, and `set`s are automatically handled for you. 😉


## Installation and Basic Usage

Install the DynamoDB Toolbox with npm:
```
npm i dynamodb-toolbox
```

Require or import `Model` from `dynamodb-toolbox`:

```javascript
const { Model } = require('dynamodb-toolbox')
```

Create your schema:

```javascript
const MyModel = new Model('MyModel',{
  // Specify table name
  table: 'my-dynamodb-table',

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  // Define schema
  schema: {
    pk: { type: 'string', alias: 'id' },
    sk: { type: 'string', hidden: true },
    data: { type: 'string', alias: 'name' },
    status: ['sk',0], // composite key mapping
    date_added: ['sk',1] // composite key mapping
  }
})
```

Put an item using the DocumentClient:

```javascript
// Require AWS SDK and instantiate DocumentClient
const DynamoDB = require('aws-sdk/clients/dynamodb')
const DocumentClient = new DynamoDB.DocumentClient()

// Create my item (using my aliases)
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28'
}

// Use the 'put' method of MyModel to generate parameters
let params = MyModel.put(item)

// Pass the parameters to the DocumentClient's `put` method
let result = await DocumentClient.put(params).promise()
```

The item will be saved to DynamoDB like this:

```javascript
{
  "pk": 123,
  "sk": "active#2019-11-28",
  "data": "Test Name"
}
```

You can then get the data:

```javascript
// Specify my item
let item = {
  id: 123,
  status: 'active',
  date_added: '2019-11-28'
}

// Use the 'get' method of MyModel to generate parameters
let params = MyModel.get(item)

// Pass the parameters to the DocumentClient's `get` method
let response = await DocumentClient.get(params).promise()

// Parse the raw response with the `parse` method
let result = MyModel.parse(response)
```

This will return the object mapped to your aliases and composite key mappings:

```javascript
{
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28'
}
```

## Specifying Models and Schemas

The `Model` takes two parameters. The first is a `string` that represents the **name** of the model. The second parameter is an `object` that accepts the following properties:

| Property | Type | Required | Description |
| -------- | :--: | :--: | ----------- |
| table  | `String` | yes | The name of your DynamoDB table |
partitionKey | `String` | yes | Name of the field that represents your partition key |
sortKey | `String` | no | Name of the field that represents your sort key |
model | `Boolean` | no | Add and manage `__model` field |
timestamps | `Boolean` | no | Automatically add and manage `created` and `modified` fields |
created | `string` | no | Override default `created` field name |
modified | `string` | no | Override default `modified` field name |
schema | `object` | yes | Complex type that specifies the schema for the model (see below) |

### Schema Definition

The `schema` is an `object` that represents the field names, types, and other properties related to each field. Each key in the object represents the **field name** and the value represents its properties. The value can be a `string` that represents the field type, an an `object` that allows for additional configurations, or an `array` that maps to composite keys.

#### Using a `string`

Schema fields can be defined using only a `string` value that corresponds to a DynamoDB type.

```javascript
schema: {
  field1: 'string',
  field2: 'number',
  field3: 'list',
  field4: 'map',
  ...
}
```

Valid types are: `string`, `boolean`, `number`, `list`, `map`, `binary`, or `set`.

#### Using an `object`

For more control over a field's behavior, you can specify an object as the field's value. Some options are specific to certain types. The following properties and options are available, all of which are optional:

| Property | Type | For Types | Description |
| -------- | :--: | :--: | ----------- |
| type  | `String` | all | The DynamoDB type for this field. Valid values are `string`, `boolean`, `number`, `list`, `map`, `binary`, or `set`. Defaults to `string`. |
| coerce  | `boolean` | `string`, `boolean`, `number`, `list` | Coerce values to the specified type. Enabled by default on `string`, `boolean`, and `number`. If enabled on `list` types, the interpreter will try to split a string by commas. |
| default  | *same as* `type` or `function` | all | Specifies a default value (if none provided) when using `put` or `update`. This also supports functions for creating custom default. See more below.  |
| onUpdate  | `boolean` | all | Forces `default` values to be passed on every `update`. |
| hidden  | `boolean` | all | Hides field from returned JavaScript object when using the `parse` method. |
| required  | `boolean` or "always" | all | Specifies whether a field is required. A value of `true` requires the field for all `put` operations. A `string` value of "always" requires the field for `put` *and* `update` operations. |
| alias  | `string` | all | Adds a bidirectional alias to the field. All input methods can use either the field name or the alias when passing in data. The `parse` method will map fields to their alias. |
| setType  | `string` | `set` | Specifies the type for `set` fields. Allowed values are `string`,`number`,`binary` |

Example:

```javascript
schema: {
  pk: { type: 'string', alias: 'user_id' },
  sk: { type: 'number', hidden: true },
  data: { coerce: false, required: true, alias: 'name' },
  departments: { type: 'set', setType: 'string' },
  ...
}
```

#### Using an `array` for composite keys

Composite keys in DynamoDB are incredibly useful for creating hierarchies, one-to-many relationships, and other powerful querying capabilities (see [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-sort-keys.html)). The DynamoDB Toolbox lets you easily work with composite keys in a number of ways. In many cases, there is no need to store the data in the same record twice if you are already combining it into a single attribute. By using composite key mappings, you can store data together in a single field, but still be able to structure input data *and* parse the output into separate fields.

The basic syntax is to specify an `array` with the mapped field name as he first element, and the index in the composite key as the second element. For example:

```javascript
schema: {
  pk: { alias: 'user_id' },
  sk: { hidden: true },
  status: ['sk',0],
  date: ['sk',1],
  ...
}
```

This maps the `status` and `date` fields to the `sk` field. If a `status` and `date` are supplied, they will be combined into the `sk` field as `[status]#[date]`. When the data is retrieved, the `parse` method will automatically split the `sk` field and return the values with `status` and `date` keys. By default, the values of composite keys are not stored as separate attributes, but that can be changed by adding in an option configuration as the third array element.

**Passing in a configuration**
Composite key mappings are `string`s by default, but can be overridden by specifying either `string`,`number`, or `boolean` as the third element in the array. Composite keys are automatically coerced into `string`s, so only the aforementioned types are allowed. You can also pass in a configuration `object` as the third element. This uses the same configuration properties as above. In addition to these properties, you can also specify a `boolean` property of `save`. This will write the value to the mapped composite key, but also add a separate attribute that stores the value.

```javascript
schema: {
  pk: { alias: 'user_id' },
  sk: { hidden: true },
  status: ['sk',0, { type: 'boolean', save: true, default: true }],
  date: ['sk',1, { required: true }],
  ...
}
```

#### Customize defaults with a `function`

In simple situations, defaults can be static values. However, for advanced use cases, you can specify an anonymous function to dynamically calculate the value. The function takes a single argument that contains an object of the inputed data (including aliases). This opens up a number of really powerful use cases:

**Generate the current date and time:**

```javascript
schema: {
  pk: { alias: 'user_id' },
  created: { default: () => new Date().toISOString() },
  ...
}
```

**Generate a custom composite key:**

```javascript
schema: {
  pk: { alias: 'user_id' },
  sk: { default: (data) => `sort-${data.status}|${data.date_added}` },
  status: 'boolean',
  date_added: 'string'
  ...
}
```

**Create conditional defaults:**

```javascript
schema: {
  pk: { alias: 'user_id' },
  sk: { default: (data) => {
    if (data.status && data.date_added) {
      return data.date_added
    } else {
      return null // field will not be defaulted
    }
  } },
  status: 'boolean',
  date_added: 'string'
  ...
}
```

## Putting, Getting, and Deleting Data

The DynamoDB Toolbox has several convenience methods that helps you generate the parameters required by the DocumentClient. The three most basic are the `put`, `get` and `delete` methods.

### `put` Items

The DocumentClient [`put`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property) method accepts several parameters. The DynamoDB Toolbox will generate the `TableName` and `Items` parameters for you when you use the `put` method on your model.

```javascript
// Create my item (using aliases)
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28'
}

// Use the 'put' method of MyModel to generate parameters
let params = MyModel.put(item)
```

Based on our Model specified earlier, the `params` variable will be set to:

```javascript
{
  TableName: 'my-dynamodb-table',
  Item: {
    "pk": 123,
    "sk": "active#2019-11-28",
    "data": "Test Name"
  }
}
```

This can be sent directly to the `put` method of the DocumentClient:

```javascript
// Pass the parameters to the DocumentClient's `put` method
let result = await DocumentClient.put(params).promise()
```

If you need to add additional parameters, you can either merge the `params` object with your settings, or even easier, pass them in as the second argument to the `put` method:

```javascript
let params = MyModel.put(item, {
  ReturnConsumedCapacity: 'TOTAL',
  ReturnValues: 'ALL_NEW'
})
```

### `get` Items

Getting items requires the `partitionKey` and (if configured) the `sortKey`. The DocumentClient [`get`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property) method accepts a number of parameters. The DynamoDB Toolbox will generate the `TableName` and `Key` parameters for you based on your input. If you have composite key mappings or aliases on your `partitionKey` or `sortKey`, the appropriate values will be generated.

Based on our model from before:

```javascript
// Specify my item
let item = {
  id: 123,
  status: 'active',
  date_added: '2019-11-28'
}

// Use the 'get' method of MyModel to generate parameters
let params = MyModel.get(item)
```

This will generate the following parameters:

```javascript
{
  TableName: 'my-dynamodb-table',
  Key: {
    "pk": 123,
    "sk": "active#2019-11-28"
  }
}
```

You could also specify the `pk` and `sk` values directly and achieve the same result:

```javascript
let params = MyModel.get({
  pk: 123,
  sk: 'active#2019-11-28'
})
```

As with the `put` method, you can add your own parameters as the second argument:

```javascript
let params = MyModel.get(item, {
  ConsistentRead: true,
  ReturnConsumedCapacity: 'TOTAL'
})
```

### `query` Items

Querying items requires the `partitionKey` and (if wanted) you can include `options` with some additional query data. 
The DocumentClient [`query`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property) 
method accepts a number of parameters. The DynamoDB Toolbox will generate the `TableName` and other parameters 
for you based on your input. 

Based on our model from before:

```javascript
// Specify my item
let item = {
  id: 123,
  status: 'active',
  date_added: '2019-11-28'
}

// Use the 'query' method of MyModel to generate parameters
let params = MyModel.query(item.id)
```

This will generate the following parameters:

```javascript
{ 
  TableName: 'my-dynamodb-table',
  ConsistentRead: false,
  KeyConditionExpression: '#pk = :pk',
  ExpressionAttributeNames: { '#pk': 'pk' },
  ExpressionAttributeValues: { ':pk': '123' }
}
```

You can pass in additional options to the query.  The most useful is the `sortKey` object, but you can also specify:
* limit (number) - maximum number of items to return
* consistentRead (boolean) - run the query with/without consistent reads
* index (string) - run the query against a different LSI or GSI

The `sortKey` option is an object that looks like this:
```javascript
{
  value: 'someValue',
  operator: '=', // =, >, >=, <, <=, between, begins_with
  secondaryValue: 'secondValue' // optional, only used with between operator
}
```

A more complex query could look like this:
```javascript
let params = MyModel.query(
  '123', 
  { 
    sortKey: { value: '2011', secondaryValue: '2020', operator: 'between' }, 
    limit: 10, 
    index: 'gsi1',
    consistentRead: true
  }
})
```

Which would return parameters for DocumentClient that looks like:
```javscript
{ 
  TableName: 'my-dynamodb-table',
  IndexName: 'gsi1',
  ConsistentRead: true,
  KeyConditionExpression: '#pk = :pk and #sk between :value1 and :value2',
  ExpressionAttributeNames: { 
    '#pk': 'pk',
    '#sk': 'sk' 
  },
  ExpressionAttributeValues: { 
    ':pk': '123',
    ':value1': '2011',
    ':value2': '2020' 
  },
  Limit: '10'
}
```

### `delete` Items

The DocumentClient [`delete`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property) method accepts a number of parameters. Similar to the `get` method, the DynamoDB Toolbox will generate the `TableName` and `Key` parameters for you based on your input. If you have composite key mappings or aliases on your `partitionKey` or `sortKey`, the appropriate values will be generated. You can add custom parameters as a second argument.

## Updating Data (the fun stuff)

The DocumentClient [`update`](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property) method accepts a number of parameters. The DynamoDB Toolbox will generate the `TableName`, `Key`, `ExpressionAttributeNames`, `ExpressionAttributeValues`, and the `ConditionExpression` for you. The values of these parameters are determined by your model's schema and the input data.

`ConditionExpression`s can get complicated very quickly, so this library makes it super simple to build complex clauses with type guarantees, defaults, composite key generation, and more. Like with the other methods, you can pass the parameters directly into the DocumentClient's `update` method.

The DynamoDB Toolbox's `update` method is optimized for **upserts** that can safely insert and update items using conditionals on defaults.

Basic example:

```javascript
// Data to insert update
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28'
}

let params = MyModel.update(item)
```

Will generate the following params:

```javascript
{
  TableName: 'my-dynamodb-table',
  Key: { pk: '123', sk: 'active#2019-11-28' },
  UpdateExpression: 'SET #data = :data',
  ExpressionAttributeNames: { '#data': 'data' },
  ExpressionAttributeValues: { ':data': 'Test Name' }
}
```

This is a fairly straightforward update query (but notice the `sk` value is generated from the input). Let's build something more complex.

```javascript
const MyNewModel = new Model('MyNewModel',{
  // Specify table name
  table: 'my-dynamodb-table',

  // Add timestamps
  timestamps: true,

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  // Define schema
  schema: {
    pk: { type: 'string', alias: 'id' },
    sk: { type: 'string', hidden: true },
    data: { type: 'string', alias: 'name' },
    status: ['sk',0], // composite key mapping
    date_added: ['sk',1], // composite key mapping
    roles: { type: 'set', setType: 'string' },
    level: { type: 'number', default: 1 },
    sessions: { type: 'list' },
    metadata: { type: 'map' }
  }
})

let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28',
  roles: ['user','admin']
}

let params = MyNewModel.update(item)
```

Will generate the following parameters:

```javascript
{
  TableName: 'my-dynamodb-table',
  Key: { pk: '123', sk: 'active#2019-11-28' },
  UpdateExpression: 'SET #level = if_not_exists(#level,:level), #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified, #data = :data, #roles = :roles',
  ExpressionAttributeNames: {
    '#level': 'level',
    '#__model': '__model',
    '#created': 'created',
    '#modified': 'modified',
    '#data': 'data',
    '#roles': 'roles'
  },
  ExpressionAttributeValues: {
    ':level': 1,
    ':__model': 'MyNewModel',
    ':created': '2019-11-29T03:22:16.552Z',
    ':modified': '2019-11-29T03:22:16.552Z',
    ':data': 'Test Name',
    ':roles': Set { wrapperName: 'Set', values: ['user','admin'], type: 'String' }
  }
}
```

This `UpdateExpression` is now getting more complex, but all you needed to do was supply a simple JavaScript object with your data and the library handles the rest. Notice that the `level` was automatically defaulted to `1`, but also has the `if_not_exists` guarantee to avoid overwriting the data on a partial update. We've also added automatic timestamps to this model, so the `created` attribute is created when the item is created, and is left untouched for subsequent updates. The `modified` value is updated on every update.

**But wait, there's more!** The `UpdateExpression` lets you do all kinds of crazy things like `REMOVE` attributes, `ADD` values to numbers and sets, and manipulate arrays. The DynamoDB Toolbox has simple ways to deal with all these different operations by properly formatting your input data.

### Removing an attribute

To remove an attribute, set the value in your object to `null` or an empty string.

```javascript
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28',
  roles: null
}
```

### Adding a number to a `number` attribute

DynamoDB lets us add (or subtract) numeric values from an attribute in the table. If no value exists, it simply puts the value. Adding with the DynamoDB Toolbox is just a matter of supplying an `object` with an `$add` key on the number fields you want to update.

```javascript
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28',
  level: { $add: 2 } // add 2 to level
}
```


### Adding values to a `set`

Sets are similar to lists, but they enforce unique values of the same type. To add new values to a set, use an `object` with an `$add` key and an array of values.

```javascript
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28',
  roles: { $add: ['author','support'] }
}
```

### Deleting values from a `set`

To delete values from a `set`, use an `object` with a `$delete` key and an array of values to delete.

```javascript
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28',
  roles: { $delete: ['admin'] }
}
```

### Appending (or prepending) values to a `list`

To append values to a `list`, use an `object` with an `$append` key and an array of values to append.

```javascript
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28',
  sessions: { $append: [ { date: '2019-11-28', duration: 101 } ] }
}
```

Alternatively, you can use the `$prepend` key and it will add the values to the beginning of the list.

### Remove items from a `list`

To remove values from a `list`, use an `object` with a `$remove` key and an array of **indexes** to remove. Lists are indexed starting at `0`, so the update below would remove the second, fifth, and sixth item in the array.

```javascript
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28',
  sessions: { $remove: [1,4,5] }
}
```

### Update items in a `list`

To update values in a `list`, specify an `object` with array indexes as the keys and the update data as the values. Lists are indexed starting at `0`, so the update below would update the second and fourth items in the array.

```javascript
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28',
  sessions: {
    1: 'some new value for the second item',
    3: 'new value for the fourth value'
  }
}
```

### Update nested data in a `map`

Maps can be complex, deeply nested JavaScript objects with a variety of data types. The DynamoDB Toolbox doesn't support schemas for `map`s (yet), but you can still manipulate them by wrapping your updates in a `$set` parameter and using dot notation and array index notation to target fields.

```javascript
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28',
  metadata: {
    $set: {
      'title': 'Developer', // update metadata.title
      'contact.name': 'Jane Smith', // update metadata.contact.name
      'contact.addresses[0]': '123 Main Street' // update the first array item in metadata.contact.addresses
    }
  }
}
```

We can also use our handy `$add`, `$append`, `$prepend`, and `$remove` properties to manipulate nested values.

```javascript
let item = {
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28',
  metadata: {
    $set: {
      'vacation_days': { $add: -2 },
      'contact.addresses': { $append: ['99 South Street'] },
      'contact.phone': { $remove: [1,3] }
    }
  }
}
```

### Adding custom parameters and clauses

If you need to pass custom parameters, simply pass them in an object as the second parameter.

```javascript
let params = MyModel.update(item, {
  ReturnConsumedCapacity: 'TOTAL',
  ReturnValues: 'ALL_NEW'
})
```

If you want to add additional statements to the claues, you can add them as arrays to the `SET`, `ADD`, `REMOVE` and `DELETE` properties in the second parameter. You can also specify additional `ExpressionAttributeNames` and `ExpressionAttributeValues` with object values and the system will merge them in with the generated ones.

```javascript
let params = MyModel.update(item, {
  SET: ['#somefield = :somevalue'],
  ExpressionAttributeNames: { '#somefield': 'somefield' },
  ExpressionAttributeValues: { ':somevalue': 123 }  
})
```

## Parsing and Formatting Data

The DynamoDB Toolbox offers a `parse` method that will convert the output of your DynamoDB queries into JavaScript objects mapped to your aliases. The `parse` method behaves differently based on the input.

### Passing an object containing an `Item`

If you pass an object that has a single `Item`, the `parse` method will return a single object mapped to your aliases.

```javascript
// Object returned from DynamoDB
let response = {
  Item: {
    "pk": 123,
    "sk": "active#2019-11-28",
    "data": "Test Name"
  }
}

// Parse the raw response with the `parse` method
let result = MyModel.parse(response)

// Output:
{
  id: 123,
  name: 'Test Name',
  status: 'active',
  date_added: '2019-11-28'
}
```

### Passing an object containing multiple `Items`

If you pass an object that has an `Items` field, the `parse` method will iterate through the `Items` and return an array of objects mapped to your aliases.

### Passing a plain object

If you pass an object that has niether an `Item` nor `Items` key, the `parse` method will attempt to map the object to your schema and return a single object.

## Additional References

- [DocumentClient SDK Reference](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)
- [Best Practices for DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [DynamoDB, explained.](https://www.dynamodbguide.com/)

## Contributions and Feedback
Contributions, ideas and bug reports are welcome and greatly appreciated. Please add [issues](https://github.com/jeremydaly/dynamodb-toolbox/issues) for suggestions and bug reports or create a pull request. You can also contact me on Twitter: [@jeremy_daly](https://twitter.com/jeremy_daly).
