---
title: Overview
---

# Overview

AWS DynamoDB is a [key-value database designed to run high-performance applications at any scale](https://aws.amazon.com/dynamodb). It automatically scales up and down based on your current traffic, and does not require maintaining connections, which makes it the **go-to DB service for serverless developers on AWS**.

AWS published a SDK, the [document client](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html), to craft said requests. However, if you’ve ever used it, you will know that **it’s still very painful to use**.

For instance, let’s look at this `UpdateCommand` example from the [DynamoDB docs itself](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.UpdateItem.html):

```tsx
await documentClient.send(
  new UpdateCommand({
    TableName: 'movies-table',
    Key: {
      // 👇 No type-safety on the primary key
      title: 'Mewtwo Strikes Back',
      year: 1998
    },
    // 👇 String expressions hard to build (and still no type-safety)
    UpdateExpression: 'set info.plot = :p, info.#r = :r',
    // 👇 When used in Expressions, attribute names have to be provided separately
    ExpressionAttributeNames: {
      '#r': 'rank'
    },
    // 🤦‍♂️ List of attribute names as comma-separated strings
    ProjectionExpression: '#r',
    // 👇 Attribute values have to be provided separately
    ExpressionAttributeValues: {
      // 👇 No validation or type-safety to enforce DB schema
      ':p':
        'A synthetic Pokemon, Mewtwo, rebels against the scientists of Team Rocket who created it.',
      ':r': 4.1
    }
  })
)
```

It is a very simple example (updating two fields of a `Movie` item), yet already very verbose 😅 And **things only get messier as the complexity of your business logic grows**: What if your items have 20 attributes? With some of them deeply nested? Or optional? What if you want to index an item or not depending on its values (e.g. a `status` attribute)? What about polymorphism?

In those cases (which are quite common) **the required code to generate those requests can get very hard to maintain**.

That's when DynamoDB-Toolbox comes to the rescue 💪 It aims at:

- 🏋️‍♀️ Simplifying the writing of DynamoDB requests
- 📐 Adding run-time **data validation**, i.e. **“artificial” schemas** to a schema-less DB (and more recently type-safety)
- Also: Single-table design, transforming of attributes to reduce costs, projection on secondary indexes.

For instance, here is an example of the same `UpdateCommand` with DynamoDB-Toolbox:

```tsx
import {
  Table,
  Entity,
  string,
  number,
  map,
  UpdateItemCommand
} from 'dynamodb-toolbox'

// Provided some schema specifications...
const MovieTable = new Table({
  name: 'movies-table',
  partitionKey: {
    name: 'title',
    type: 'string'
  },
  sortKey: {
    name: 'year',
    type: 'number'
  },
  documentClient // <= the original DocumentClient
})

const MovieEntity = new Entity({
  name: 'Movie',
  attributes: {
    title: string().key(),
    year: number().key(),
    info: map({
      plot: string(),
      rank: number()
    })
  },
  table: MovieTable
})

// ...we get a validated AND type-safe request method 🙌
await MovieEntity.build(UpdateItemCommand)
  .item({
    title: 'Mewtwo Strikes Back',
    year: 1998,
    info: {
      plot: 'A synthetic Pokemon, Mewtwo, rebels against..',
      rank: 4.1
    }
  })
  .send()
```

And just like that, we went from an obscure 18-line class to a readable and elegant 10-liner 🤩 Not bad, don't you think?
