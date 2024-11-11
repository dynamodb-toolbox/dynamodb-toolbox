---
title: Overview
---

# Entity

An **Entity** represent a well-defined schema for a DynamoDB item. An Entity can represent things like a _User_, an _Order_, an _Invoice Line Item_, a _Configuration Object_, or whatever else you want. Each `Entity` defined with the DynamoDB Toolbox must be attached to a `Table`. An `Entity` defines its own attributes, but can share these attributes with other entities on the same table (either explicitly or coincidentally). Entities must flag an attribute as a `partitionKey` and if enabled on the table, a `sortKey` as well.

Note that a `Table` can have multiple Entities, but an `Entity` can only have one `Table`.

## Defining an Entity

To define a new entity, import it into your script:

```typescript
import { Entity } from 'dynamodb-toolbox'

const MyEntity = new Entity({
  ...entityDefinition
  // In Typescript, the "as const" statement is needed for type inference
} as const)
```

## Specifying Entity Definitions

`Entity` takes a single parameter of type `object` that accepts the following properties:

| Property      |   Type    | Required | Description                                                                                                         |
| ------------- | :-------: | :------: | ------------------------------------------------------------------------------------------------------------------- |
| name          | `string`  |   yes    | The name of your entity (must be unique to its associated `Table`)                                                  |
| timestamps    | `boolean` |    no    | Automatically add and manage _created_ and _modified_ attributes                                                    |
| created       | `string`  |    no    | Override default _created_ attribute name (default: `_ct`)                                                          |
| modified      | `string`  |    no    | Override default _modified_ attribute name (default: `_md`)                                                         |
| createdAlias  | `string`  |    no    | Override default _created_ alias name (default: `created`)                                                          |
| modifiedAlias | `string`  |    no    | Override default _modified_ alias name (default: `modified`)                                                        |
| typeAlias     | `string`  |    no    | Override default _entity type_ alias name (default: `entity`)                                                       |
| typeHidden    | `boolean` |    no    | When enabled hides the entity type from the returned parsed data (default: _false_)                                 |
| attributes    | `object`  |   yes    | Complex type that specifies the schema for the entity (see below)                                                   |
| autoExecute   | `boolean` |    no    | Enables automatic execution of the DocumentClient method (default: _inherited from Table_)                          |
| autoParse     | `boolean` |    no    | Enables automatic parsing of returned data when `autoExecute` evaluates to `true` (default: _inherited from Table_) |
| table         |  `Table`  |    \*    | A valid `Table` instance                                                                                            |

\* _An Entity can be instantiated without a `table`, but most methods require one before execution_

## Entity Attributes

The `attributes` property is an `object` that represents the attribute names, types, and other properties related to each attribute. Each key in the object represents the **attribute name** and the value represents its properties. The value can be a `string` that represents the DynamoDB type, an `object` that allows for additional configurations, or an `array` that maps to composite keys.

### Using a `string`

Attributes can be defined using only a `string` value that corresponds to a DynamoDB type.

```typescript
const MyEntity = new Entity({
  attributes: {
    attr1: 'string',
    attr2: 'number',
    attr3: 'list',
    attr4: 'map'
    // ...
  }
} as const)
```

Valid types are: `string`, `boolean`, `number`, `list`, `map`, `binary`, or `set`.

### Using an `object`

For more control over an attribute's behavior, you can specify an object as the attribute's value. Some options are specific to certain types. The following properties and options are available, all of which are optional:

| Property     |               Type               |               For Types               | Description                                                                                                                                                                                                                                     |
| ------------ | :------------------------------: | :-----------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type         |             `String`             |                  all                  | The DynamoDB type for this attribute. Valid values are `string`, `boolean`, `number`, `list`, `map`, `binary`, or `set`. Defaults to `string`.                                                                                                  |
| coerce       |            `boolean`             | `string`, `boolean`, `number`, `list` | Coerce values to the specified type. Enabled by default on `string`, `boolean`, and `number`. If enabled on `list` types, the interpreter will try to split a string by commas.                                                                 |
| default      |  _same as_ `type` or `function`  |                  all                  | Specifies a default value (if none provided) when using `get`, `put`, `update` or `delete` methods. This also supports functions for creating custom default. See more below.                                                                   |
| dependsOn    | `string` or `array` of `string`s |                  all                  | Creates a dependency graph for default values. For example, if the attribute uses a default value that requires another attribute's default value, this will ensure dependent attributes' default values are calculated first.                  |
| onUpdate     |            `boolean`             |                  all                  | Forces `default` values to be passed on every `update`.                                                                                                                                                                                         |
| save         |            `boolean`             |                  all                  | Specifies whether this attribute should be saved to the table. Defaults to `true`.                                                                                                                                                              |
| hidden       |            `boolean`             |                  all                  | Hides attribute from returned JS object when auto-parsing is enabled or when using the `parse` method.                                                                                                                                          |
| required     |      `boolean` or "always"       |                  all                  | Specifies whether an attribute is required. A value of `true` requires the attribute for all `put` operations. A `string` value of "always" requires the attribute for `put` _and_ `update` operations.                                         |
| alias        |             `string`             |                  all                  | Adds a bidirectional alias to the attribute. All input methods can use either the attribute name or the alias when passing in data. Auto-parsing and the `parse` method will map attributes to their alias.                                     |
| map          |             `string`             |                  all                  | The inverse of the `alias` option, allowing you to specify your alias as the key and map it to an attribute name.                                                                                                                               |
| setType      |             `string`             |                 `set`                 | Specifies the type for `set` attributes. Allowed values are `string`,`number`,`binary`                                                                                                                                                          |
| delimiter    |             `string`             |           _composite keys_            | Specifies the delimiter to use if this attribute stores a composite key (see [Using an `array` for composite keys](#using-an-array-for-composite-keys))                                                                                         |
| prefix       |             `string`             |               `string`                | A prefix to be added to an attribute when saved to DynamoDB. This prefix will be removed when parsing the data.                                                                                                                                 |
| suffix       |             `string`             |               `string`                | A suffix to be added to an attribute when saved to DynamoDB. This suffix will be removed when parsing the data.                                                                                                                                 |
| transform    |            `function`            |                  all                  | A function that transforms the input before sending to DynamoDB. This accepts two arguments, the value passed and an object containing the data from other attributes.                                                                          |
| format       |            `function`            |                  all                  | A function that transforms the DynamoDB output before sending it to the parser. This accepts two arguments, the value of the attribute and an object containing the whole item.                                                                 |
| partitionKey |      `boolean` or `string`       |                  all                  | Flags an attribute as the 'partitionKey' for this Entity. If set to `true`, it will be mapped to the Table's `partitionKey`. If set to the name of an **index** defined on the Table, it will be mapped to the secondary index's `partitionKey` |
| sortKey      |      `boolean` or `string`       |                  all                  | Flags an attribute as the 'sortKey' for this Entity. If set to `true`, it will be mapped to the Table's `sortKey`. If set to the name of an **index** defined on the Table, it will be mapped to the secondary index's `sortKey`                |

**NOTE:** One attribute _must_ be set as the `partitionKey`. If the table defines a `sortKey`, one attribute _must_ be set as the `sortKey`. Assignment of secondary indexes is optional. If an attribute is used across multiple indexes, an `array` can be used to specify multiple values.

Example:

```typescript
const MyEntity = new Entity({
  attributes: {
    user_id: { partitionKey: true },
    sk: { type: 'number', hidden: true, sortKey: true },
    data: { coerce: false, required: true, alias: 'name' },
    departments: {
      type: 'set',
      setType: 'string',
      map: 'dept'
    }
    // ...
  }
} as const)
```

### Using an `array` for composite keys

:::warning[Deprecation Notice]

Please note that this feature will likely be deprecated in a future release.

This data modeling technique is no longer advised since storing these values as separate attributes provides greater flexibility. You can still generate composite keys by using the `default` or `transform` Entity methods.

:::

Composite keys in DynamoDB are incredibly useful for creating hierarchies, one-to-many relationships, and other powerful querying capabilities (see [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-sort-keys.html)). The DynamoDB Toolbox lets you easily work with composite keys in a number of ways. In some cases, there is no need to store the data in the same record twice if you are already combining it into a single attribute. By using composite key mappings, you can store data together in a single field, but still be able to structure input data _and_ parse the output into separate attributes.

The basic syntax is to specify an `array` with the mapped attribute name as the first element, and the index in the composite key as the second element. For example:

```typescript
const MyEntity = new Entity({
  attributes: {
    user_id: { partitionKey: true },
    sk: { hidden: true, sortKey: true },
    status: ['sk', 0],
    date: ['sk', 1]
    // ...
  }
} as const)
```

This maps the `status` and `date` attributes to the `sk` attribute. If a `status` and `date` are supplied, they will be combined into the `sk` attribute as `[status]#[date]`. When the data is retrieved, the `parse` method will automatically split the `sk` attribute and return the values with `status` and `date` keys. By default, the values of composite keys are stored as separate attributes, but that can be changed by adding in an option configuration as the third array element.

**Passing in a configuration**
Composite key mappings are `string`s by default, but can be overridden by specifying either `string`,`number`, or `boolean` as the third element in the array. Composite keys are automatically coerced into `string`s, so only the aforementioned types are allowed. You can also pass in a configuration `object` as the third element. This uses the same configuration properties as above. In addition to these properties, you can also specify a `boolean` property of `save`. This will write the value to the mapped composite key, but also add a separate attribute that stores the value.

```typescript
const MyEntity = new Entity({
  attributes: {
    user_id: { partitionKey: true },
    sk: { hidden: true, sortKey: true },
    status: [
      'sk',
      0,
      { type: 'boolean', save: false, default: true }
    ],
    date: ['sk', 1, { required: true }]
    // ...
  }
} as const)
```

### Customize defaults with a `function`

In simple situations, defaults can be static values. However, for advanced use cases, you can specify an anonymous function to dynamically calculate the value. The function takes a single argument that contains an object of the inputted data (including aliases). Sadly, in TS, type inference cannot be used here as this would create a circular dependency.

This opens up a number of really powerful use cases:

**Generate the current date and time:**

```typescript
const MyEntity = new Entity({
  attributes: {
    user_id: { partitionKey: true },
    created: { default: () => new Date().toISOString() }
    // ...
  }
} as const)
```

**Generate a custom composite key:**

```typescript
const MyEntity = new Entity({
  attributes: {
    user_id: { partitionKey: true },
    sk: {
      sortKey: true,
      default: (data: {
        status: boolean
        date_added: string
      }) => `sort-${data.status}|${data.date_added}`
    },
    status: 'boolean',
    date_added: 'string'
    // ...
  }
} as const)
```

**Create conditional defaults:**

```typescript
const MyEntity = new Entity({
  attributes: {
    user_id: { partitionKey: true },
    sk: {
      sortKey: true,
      default: (data: {
        status: boolean
        date_added: string
      }) => {
        if (data.status && data.date_added) {
          return data.date_added
        } else {
          return null // field will not be defaulted
        }
      }
    },
    status: 'boolean',
    date_added: 'string'
    // ...
  }
} as const)
```
