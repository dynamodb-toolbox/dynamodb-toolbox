# DynamoDB Toolbox <!-- omit in toc -->

![dynamodb-toolbox](https://user-images.githubusercontent.com/2053544/69847647-b7910780-1245-11ea-8403-a35a0158f3aa.png)

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/dynamodb-toolbox">
    <img alt="" src="https://img.shields.io/npm/v/dynamodb-toolbox?color=a2c8f7&style=for-the-badge">
  </a>
  <a aria-label="License" href="https://github.com/dynamodb-toolbox/dynamodb-toolbox/blob/main/LICENSE">
    <img alt="" src="https://img.shields.io/github/license/dynamodb-toolbox/dynamodb-toolbox?color=%230e355b&style=for-the-badge">
  </a>
    <img alt="" src=https://img.shields.io/npm/dt/dynamodb-toolbox?color=%232e6ca9&style=for-the-badge>
    <br/>
    <br/>
</p>

---

<p align="center"><b>Light-weight</b> and <b>type-safe</b><br/><b>query builder</b> for DynamoDB and TypeScript.</p>

---

DynamoDB-Toolbox is a light abstraction layer over the DocumentClient that **turns your DynamoDB journey into a ✨ bliss ✨**

## Features <!-- omit in toc -->

🤗 **Simpler queries**: DynamoDB-Toolbox does all the heavy-lifting of crafting those **complex DynamoDB requests**. It makes your code **clearer**, **more concise** and **easier to maintain**.

📐 **Data validation**: Both pushed and fetched items are **validated** against your schemas, which guarantees the **consistency** of your data and the **reliability** of your code.

✨ **A rich schema syntax** that supports a broad range of edge cases like **defaults**, **composition**, **transformation** and **polymorphism**.

🌈 **Type-safety pushed to the limit**: Increase your development velocity with **instantaneous feedbacks** and **slick auto-completion**.

🌴 **Tree-shakable**: Only import what you need.

☝️ **Single-table designs**: DynamoDB-Toolbox makes **querying multiple entities within the same table extremely simple**, although it works just as well with multiple tables.

## Visit the 👉 [official documentation](https://dynamodbtoolbox.com/) 👈 to get started! <!-- omit in toc -->

## Why use it? <!-- omit in toc -->

If you're here, we're assuming you know DynamoDB.

If you don't, check out the [official AWS docs](https://aws.amazon.com/dynamodb).

> **TLDR**: _[DynamoDB](https://aws.amazon.com/dynamodb) is a key-value DB designed to run high-performance applications at any scale. It **automatically scales** up and down based on your current traffic, and removes the need to maintain connections, which makes it the **go-to DB for many projects**, including (but not limited to) **serverless applications**._

If you've ever used the official [Document Client](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html), you know that **it’s painful to use**.

Take a look at this `UpdateCommand` example straight from the [AWS documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/UpdateItemCommand/):

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

It's a very simple example (updating two fields of a `Music` item), yet already complex 😰

**Things only get messier as your data grows in complexity**: What if your items have many attributes, some nested or optional? What if you need to index an item based on its value or handle different types of items? What about polymorphism?

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

And just like that, we went from an obscure 20 lines to a **readable and elegant 10-liner** 🤩

Not bad, eh? [Let's get started](https://dynamodbtoolbox.com/)!

### [Become a Sponsor!](https://github.com/sponsors/thomasaribart/)
