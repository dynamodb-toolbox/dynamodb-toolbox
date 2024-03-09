---
id: what-is-dynamodb-toolbox
title: What is DynamoDB Toolbox?
slug: /
---

# What is DynamoDB Toolbox?

**DynamoDB Toolbox** is a set of tools that makes it easy to work with [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) and the [DocumentClient](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html). It's designed with **Single Tables** in mind, but works just as well with multiple tables. It lets you define your Entities (with typings and aliases) and map them to your DynamoDB tables. You can then **generate the API parameters** to `put`, `get`, `delete`, `update`, `query`, `scan`, `batchGet`, and `batchWrite` data by passing in JavaScript objects. The DynamoDB Toolbox will map aliases, validate and coerce types, and even write complex `UpdateExpression`s for you. 😉

:::info IMPORTANT

### This is NOT an ORM!

There are several really good Object-Relational Mapping tools (ORMs) out there for DynamoDB. There's the [Amazon DynamoDB DataMapper For JavaScript](https://github.com/awslabs/dynamodb-data-mapper-js), [@Awspilot's DynamoDB](https://awspilot.dev/) project, [@baseprime's dynamodb](https://github.com/baseprime/dynamodb) package, and many more.

If you like working with ORMs, that's great, and you should definitely give these projects a look. But personally, I really dislike ORMs (especially ones for relational databases). I typically find them cumbersome and likely to generate terribly inefficient queries (you know who you are). So this project is not an ORM, or at least it's not trying to be. This library helps you generate the necessary parameters needed to interact with the DynamoDB API by giving you a **consistent interface** and **handling all the heavy lifting** when working with the DynamoDB API. For convenience, this library will call the DynamoDB API for you and automatically parse the results, but you're welcome to just let it generate all (or just some) of the parameters for you. Hopefully this library will make the vast majority of your DynamoDB interactions super simple, and maybe even a little bit fun! 😎

:::

## Features

- **Table Schemas and DynamoDB Typings:** Define your Table and Entity data models using a simple JavaScript object structure, assign DynamoDB data types, and optionally set defaults.
- **Magic UpdateExpressions:** Writing complex `UpdateExpression` strings is a major pain, especially if the input data changes the underlying clauses or requires dynamic (or nested) attributes. This library handles everything from simple `SET` clauses, to complex `list` and `set` manipulations, to defaulting values with smartly applied `if_not_exists()` to avoid overwriting data.
- **Bidirectional Mapping and Aliasing:** When building a single table design, you can define multiple entities that map to the same table. Each entity can reuse fields (like `pk` and`sk`) and map them to different aliases depending on the item type. Your data is automatically mapped correctly when reading and writing data.
<!-- - **Composite Key Generation and Field Mapping:** Doing some fancy data modeling with composite keys? Like setting your `sortKey` to `[country]#[region]#[state]#[county]#[city]#[neighborhood]` model hierarchies? DynamoDB Toolbox lets you map data to these composite keys which will both autogenerate the value _and_ parse them into fields for you. -->
- **Type Coercion and Validation:** Automatically coerce values to strings, numbers and booleans to ensure consistent data types in your DynamoDB tables. Validate `list`, `map`, and `set` types against your data. Oh yeah, and `set`s are automatically handled for you. 😉
- **Derived State:** Define Entity derived states. These sates will be calculated from a dynamodb response for you.
- **Powerful Query Builder:** Specify a `partitionKey`, and then easily configure your sortKey conditions, filters, and attribute projections to query your primary or secondary indexes. This library can even handle pagination with a simple `.next()` method.
- **Simple Table Scans:** Scan through your table or secondary indexes and add filters, projections, parallel scans and more. And don't forget the pagination support with `.next()`.
- **Filter and Condition Expression Builder:** Build complex Filter and Condition expressions using a standardized `array` and `object` notation. No more appending strings!
- **Projection Builder:** Specify which attributes and paths should be returned for each entity type, and automatically filter the results.
- **Secondary Index Support:** Map your secondary indexes (GSIs and LSIs) to your table, and dynamically link your entity attributes.
- **Batch Operations:** Full support for batch operations with a simpler interface to work with multiple entities and tables.
- **Transactions:** Full support for transaction with a simpler interface to work with multiple entities and tables.
- **Default Value Dependency Graphs:** Create dynamic attribute defaults by chaining other dynamic attribute defaults together.
- **TypeScript Support:** v0.4 of this library provides strong typing support AND type inference 😍. Inferred type can still overriden with [Overlays](/docs/type-inference/#overlays). Some [Utility Types](/docs/type-inference/#utility-types) are also exposed. Additional work is still required to support schema validation & typings.

## Conventions and Motivations

One of the most important goals of this library is to be as **unopinionated** as possible, giving you the flexibility to bend it to your will and build amazing applications. But another important goal is developer efficiency and ease of use. In order to balance these two goals, some assumptions had to be made. These include the "default" behavior of the library (all of which, btw, can be disabled with a simple configuration change).

- **`autoExecute` and `autoParse` are enabled by default.** The original version of this library only handled limited "parameter generation", so it was necessary for you to pass the payloads to the `DocumentClient`. The library now provides support for all API options for each supported method, so by default, it will make the DynamoDB API call and parse the results, saving you redundant code. If you'd rather it didn't do this, you can disable it.
- **It assumes a Single Table DynamoDB design.** Watch the Rick Houlihan videos and read [Alex DeBrie's book](https://www.dynamodbbook.com). The jury is no longer out on this: Single Table designs are what all the cool kids are doing. This library assumes that you will have multiple "Entities" associated with a single "Table", so this requires you to instantiate a `Table` and add at least one `Entity` to it. If you have multiple `Table`s and just one `Entity` type per `Table`, that's fine, it'll still make your life much easier. Also, `batchGet` and `batchWrite` support multiple tables, so we've got you covered.
- **Entity Types are added to all items.** Since this library assumes a Single Table design, it needs a way to reliably distinguish between Entity types. It does this by adding an "Entity Type" attribute to each item in your table named `_et` (short for "Entity Type"). Don't like this? Well, you can either disable it completely (but the library won't be able to parse entities into their aliases for you), or change the attribute name to something more snappy. It is purposefully short to minimize table storage (because item storage size includes the attribute names). Also, by default, Entities will alias this field to `entity` (but you can change that too).
- **Created and modified timestamps are enabled by default.** I can't think of many instances where created and modified timestamps aren't used in database records, so the library automatically adds `_ct` and `_md` attributes when items are `put` or `update`d. Again, these are kept purposefully short. You can disable them, change them, or even implement them yourself if you really want. By default, Entities will alias these attributes to `created` and `modified` (customizable, of course), and will automatically apply an `if_not_exists()` on updates so that the `created` date isn't overwritten.
- **Option names have been shortened using camelCase.** Nothing against long and descriptive names, but typing `ReturnConsumedCapacity` over and over again just seems like extra work. For simplification purposes, all API request parameters have been shortened to things like `capacity`, `consistent` and `metrics`. The documentation shows which parameter they map to, but they should be intuitive enough to guess.
- **All configurations and options are plain JavaScript `objects`.** There are lots of JS libraries that use function chaining (like `table.query('some pk value').condition('some condition').limit(50)`). I really like this style for lots of use cases, but it **just feels wrong** to me when using DynamoDB. DynamoDB is the OG of cloud native databases. It's configured using IaC and its API is HTTP-based and uses structured JSON, so writing queries and other interactions using its native format just seems like the right thing to do. IMO, this makes your code more explicit and easier to reason about. Your `options` could actually be stored as JSON and (unless you're using functions to define defaults on Entity attributes) your Table and Entity configurations could be too.
- **API responses match the DynamoDB API responses.** Something else I felt strongly about was the response signature returned by the library's methods. The DynamoDB Toolbox is a tool to help you interact with the DynamoDB API, **NOT a replacement for it**. ORMs typically trade ease of use with a tremendous amount of lock-in. But at the end of the day, it's just generating queries (and probably bad ones at that). DynamoDB Toolbox provides a number of helpful features to make constructing your API calls easier and more consistent, but the exact payload is always available to you. You can rip out this library whenever you want and just use the raw payloads if you really wanted to. This brings us to the responses. Other than aliasing the `Items` and `Attributes` returned from DynamoDB, the structure and format of the responses is the **exact same** (including any other meta data returned). This not only makes the library (kind of) future proof, but also allows you to reuse or repurpose any code or tools you've already written to deal with API responses.
- **Attributes with NULL values are removed (by default).** This was a hard one. I actually ran a [Twitter poll](https://twitter.com/jeremy_daly/status/1256259584819449856) to see how people felt about this, and although the reactions were mixed, _"Remove the attributes"_ came out on top. I can understand the use cases for `NULL`s, but since NoSQL database attribute names are part of the storage considerations, it seems more logical to simply check for the absence of an attribute, rather than a `NULL` value. You may disagree with me, and that's cool. I've provided a `removeNullAttributes` table setting that allows you to disable this and save `NULL` attributes to your heart's content. I wouldn't, but the choice is yours.

Hopefully these all make sense and will make working with the library easier.

## Installation and Basic Usage

### Install DynamoDB Toolbox

```bash
# npm
npm i dynamodb-toolbox

# yarn
yarn add dynamodb-toolbox
```

Require or import `Table` and `Entity` from `dynamodb-toolbox`:

```typescript
import { Table, Entity } from 'dynamodb-toolbox'
```

:::caution Please Note

This library **DOES NOT** create DynamoDB Tables for you. You must create the tables yourself (either via the console or some form of Infrastructure as Code).

:::

### Define a Table

```typescript

// >=v0.8.0
import { DynamoDB, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const marshallOptions = {
  // Specify your client options as usual
  convertEmptyValues: false 
}

const translateConfig = { marshallOptions }

export const DocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient(), translateConfig)

// <v0.8.0
import DynamoDB from 'aws-sdk/clients/dynamodb'

const DocumentClient = new DynamoDB.DocumentClient({
  // Specify your client options as usual
  convertEmptyValues: false
})

// Instantiate a table
const MyTable = new Table({
  // Specify table name (used by DynamoDB)
  name: 'my-table',

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  // Add the DocumentClient
  DocumentClient
})
```

### Define an Entity

```typescript
const Customer = new Entity({
  // Specify entity name
  name: 'Customer',

  // Define attributes
  attributes: {
    id: { partitionKey: true }, // flag as partitionKey
    sk: { hidden: true, sortKey: true }, // flag as sortKey and mark hidden
    age: { type: 'number' }, // set the attribute type
    name: { type: 'string', map: 'data' }, // map 'name' to table attribute 'data'
    emailVerified: { type: 'boolean', required: true }, // specify attribute as required
    co: { alias: 'company' }, // alias table attribute 'co' to 'company'
    status: ['sk', 0], // composite key mapping
    date_added: ['sk', 1] // composite key mapping
  },

  // Assign it to our table
  table: MyTable

  // In Typescript, the "as const" statement is needed for type inference
} as const)
```

### Put an item

```typescript
// Create an item (using table attribute names or aliases)
const customer = {
  id: 123,
  age: 35,
  name: 'Jane Smith',
  emailVerified: true,
  company: 'ACME',
  status: 'active',
  date_added: '2020-04-24'
}

// Use the 'put' method of Customer:
await Customer.put(customer)
```

The item will be saved to DynamoDB like this:

```typescript
{
  "pk": 123,
  "sk": "active#2020-04-24",
  "age": 35,
  "data": "Jane Smith",
  "emailVerified": true,
  "co": "ACME",
  // Attributes auto-generated by DynamoDB-Toolbox
  "_et": "customer", // Entity name (required for parsing)
  "_ct": "2021-01-01T00:00:00.000Z", // Item creation date (optional)
  "_md": "2021-01-01T00:00:00.000Z" // Item last modification date (optional)
}
```

### Get an Item

```typescript
// Specify primary key
const primaryKey = {
  id: 123,
  status: 'active',
  date_added: '2020-04-24'
}

// Use the 'get' method of Customer
const response = await Customer.get(primaryKey)
```

### Entity Type Inference

Since v0.4, the method inputs, options and response types are inferred from the Entity definition:

```typescript
await Customer.put({
  id: 123,
  // ❌ Sort key is required ("sk" or both "status" and "date_added")
  age: 35,
  name: ['Jane', 'Smith'], // ❌ name should be a string
  emailVerified: undefined, // ❌ attribute is marked as required
  company: 'ACME'
})

const { Item: customer } = await Customer.get({
  id: 123,
  status: 'active',
  date_added: '2020-04-24' // ✅ Valid primary key
})
type Customer = typeof customer
// 🙌 Type is equal to:
type ExpectedCustomer =
  | {
      id: any
      age?: number | undefined
      name?: string | undefined
      emailVerified: boolean
      company?: any
      status: any
      date_added: any
      entity: string
      created: string
      modified: string
    }
  | undefined
```
