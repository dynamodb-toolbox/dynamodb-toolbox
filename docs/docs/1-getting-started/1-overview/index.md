---
title: Overview 👷
---

# Overview 👷

AWS DynamoDB is a [key-value DB designed to run high-performance applications at any scale](https://aws.amazon.com/dynamodb). It automatically scales up and down based on your current traffic, and does not require maintaining connections, which makes it the **go-to DB service for serverless developers on AWS**.

AWS published the [document client SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html), to craft said requests. However, if you’ve ever used it, you will know that **it’s still very painful to use**.

Let’s look at this `UpdateCommand` example straight from the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.UpdateItem.html):

```ts
await documentClient.send(
  new UpdateCommand({
    TableName: 'movies-table',
    Key: {
      // 👇 No type-safety on the primary key
      title: 'Mewtwo Strikes Back',
      year: 1998
    },
    // 👇 Hard-to-build string expressions (+ still no type-safety)
    UpdateExpression: 'set info.plot = :p, info.#r = :r',
    ProjectionExpression: '#r',
    // 👇 When used in Expressions, attribute names have to be provided separately
    ExpressionAttributeNames: {
      '#r': 'rank'
    },
    // 👇 Attribute values as well
    ExpressionAttributeValues: {
      // 👇 No validation or type-safety to enforce DB schema
      ':p':
        'A synthetic Pokemon, Mewtwo, rebels against the scientists of Team Rocket who created it.',
      ':r': 4.1
    }
  })
)
```

It is a very simple example (updating two fields of a `Movie` item), yet already very cumbersome and verbose 😰

**Things only get messier as your data grows in complexity**: What if your items have 20 attributes? With some of them deeply nested? Or optional? What if you want to index an item or not depending one of its attribute (e.g. a `status` attribute)? What about polymorphism?

In those cases, which are fairly common, **the required code to generate those requests gets very hard to maintain**.

That's when DynamoDB-Toolbox comes to the rescue 💪

- 🏋️‍♀️ It simplifies the writing of DynamoDB requests
- 📐 It adds run-time **data validation**, i.e. **“artificial” schemas** to a schema-less DB (and more recently type-safety)
- Also: Single-table design, transforming of attributes to reduce costs, linking attributes values to project on secondary indexes.

Here is the same `UpdateCommand` with DynamoDB-Toolbox:

```ts
// Validated AND type-safe syntax 🙌
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

And just like that, we went from an obscure 18-line class to a readable and elegant 10-liner 🤩
