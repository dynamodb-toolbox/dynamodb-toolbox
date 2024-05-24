---
title: Overview
---

# Overview

[AWS DynamoDB](https://aws.amazon.com/dynamodb) is a key-value DB designed to run high-performance applications at any scale. It automatically scales up and down based on your current traffic, and does not require maintaining connections (as requests are sent over HTTP), which makes it the **go-to DB for serverless developers**.

AWS published the [NodeJS Document Client](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html) to craft said requests. However, if you’ve ever used it, you know that **it’s painful to use**. Take a look at this `UpdateCommand` example straight from the [AWS documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.UpdateItem.html):

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

It's a very simple example (updating two fields of a `Movie` item), yet already cumbersome and verbose 😰

**Things only get messier as your data grows in complexity**: What if your items have 20 attributes? With some of them deeply nested? Or optional? What if you want to index an item or not depending one of its attribute? What about polymorphism?

In those cases, which are fairly common, **the required code to generate those requests gets very hard to maintain**.

That's when DynamoDB-Toolbox comes to the rescue 💪

---

<p align="center" style={{ fontSize:'larger' }}>DynamoDB-Toolbox is a <b>light-weight</b> and <b>type-safe</b><br/><b>query builder</b> for DynamoDB and TypeScript.</p>

---

It is an abstraction layer over the Document Client that adds many benefits:

- 🤗 **Simpler queries**: DynamoDB-Toolbox does all the heavy-lifting of crafting those **cumbersome DynamoDB requests** and make your code **clearer**, **more succinct** and **easier to maintain**.
- 📐 **Data validation**: Both pushed and fetched items are **validated** against your schemas, which guarantees the **consistency** of your data and the **reliability** of your code.
- ✨ **A rich schema syntax** that supports a broad range of edge cases like **defaults**, **composition**, **transformation** or **polymorphism**
- 🌈 **Type-safety pushed to the limit**: Increase your development velocity with **instantaneous feedbacks** and **slick auto-completion**.
- 🌴 **Tree-shakable**: Only import what you need
- 🥇 **Single-table designs**: DynamoDB-Toolbox makes **querying multiple entities within the same table extremely simple**, although it works just as well with multiple tables.

Here's is a quick preview with the DynamoDB-Toolbox version of the `UpdateCommand` described above:

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

Not bad, eh? Let's dive into it!
