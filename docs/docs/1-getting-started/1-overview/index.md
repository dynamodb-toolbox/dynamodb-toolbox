---
title: Overview
---

# What is DynamoDB-Toolbox?

---

<p align="center" style={{ fontSize:'larger' }}>DynamoDB-Toolbox is a <b>light-weight</b> and <b>type-safe</b><br/><b>query builder</b> for DynamoDB and TypeScript.</p>

---

It provides as a light abstraction layer over the SDK that **turns your DynamoDB journey into a ✨ bliss ✨**:

- 🤗 **Simpler queries**: DynamoDB-Toolbox does all the heavy-lifting of crafting those **cumbersome DynamoDB requests**. It make your code **clearer**, **more succinct** and **easier to maintain**.
- 📐 **Data validation**: Both pushed and fetched items are **validated** against your schemas, which guarantees the **consistency** of your data and the **reliability** of your code.
- ✨ **A rich schema syntax** that supports a broad range of edge cases like **defaults**, **composition**, **transformation** and **polymorphism**
- 🌈 **Type-safety pushed to the limit**: Increase your development velocity with **instantaneous feedbacks** and **slick auto-completion**
- 🌴 **Tree-shakable**: Only import what you need
- ☝️ **Single-table designs**: DynamoDB-Toolbox makes **querying multiple entities within the same table extremely simple**, although it works just as well with multiple tables.

## Why use it?

If you're here, we're assuming you know DynamoDB. If you don't, check out the [official AWS docs](https://aws.amazon.com/dynamodb).

:::infoTL;DR

[DynamoDB](https://aws.amazon.com/dynamodb) is a key-value DB designed to run high-performance applications at any scale. It **automatically scales** up and down based on your current traffic, and removes the need to maintain connections, which makes it the **go-to DB for many projects**, including (but not limited to) **serverless applications**.

:::

If you've ever used the official [Document Client](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html), you know that **it’s painful to use**. Take a look at this `UpdateCommand` example straight from the [AWS documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/UpdateItemCommand/):

```ts
await documentClient.send(
  new UpdateCommand({
    TableName: 'Music',
    Key: {
      // 👇 No type-safety on the Primary Key
      artist: 'Acme Band',
      songTitle: 'Happy Day'
    },
    // 👇 Complex string expressions (+ still no type-safety)
    UpdateExpression: 'SET #Y = :y, #AT = :t',
    // 👇 Attribute names provided separately
    ExpressionAttributeNames: {
      '#AT': 'albumTitle',
      '#Y': 'year'
    },
    // 👇 Attribute values as well
    ExpressionAttributeValues: {
      // 👇 No validation or type-safety to enforce DB schema
      ':t': 'Louder Than Ever',
      ':y': '2015'
    },
    ReturnValues: 'ALL_NEW'
  })
)
```

It's a very simple example (updating two fields of a `Music` item), yet already cumbersome 😰

**Things only get messier as your data grows in complexity**: What if your items have 20 attributes? With some of them nested or optional? What if you want to index an item depending on its value? What about polymorphism?

In those cases, which are fairly common, **the required code to generate those requests gets very hard to maintain**. That's when DynamoDB-Toolbox comes to the rescue 💪

Here's is a quick preview with the DynamoDB-Toolbox version of the `UpdateCommand` described above:

```ts
// Validated AND type-safe syntax 🙌
await MusicEntity.build(UpdateItemCommand)
  .item({
    artist: 'Acme Band',
    songTitle: 'Happy Day',
    albumTitle: 'Louder Than Ever',
    year: '2015'
  })
  .options({ returnValues: 'ALL_NEW' })
  .send()
```

And just like that, we went from an obscure 20-lines class to a **readable and elegant 10-liners** 🤩

Not bad, eh? Let's [dive into it](../2-installation/index.md)!
