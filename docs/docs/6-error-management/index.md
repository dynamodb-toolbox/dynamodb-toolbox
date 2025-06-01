---
title: 💥 Error management
---

# Error Management

When DynamoDB-Toolbox encounters an unexpected input, it throws an instance of `DynamoDBToolboxError`, which itself extends the native `Error` class with a `code` property:

```ts
await PokemonEntity
  .build(PutItemCommand)
  .item({ ..., level: 'not a number' })
  .send();
// ❌ [parsing.invalidAttributeInput] Attribute 'level' should be a number
```

Some `DynamoDBToolboxErrors` also expose a `path` property (mostly in validations) and/or a `payload` property for additional context.

If you need to handle them, TypeScript is your best friend, as the `code` property correctly distinguish the `DynamoDBToolboxError` type:

```ts
import { DynamoDBToolboxError } from 'dynamodb-toolbox';

const handleError = (error: Error) => {
  if (!error instanceof DynamoDBToolboxError) throw error;

  switch (error.code) {
    case 'parsing.invalidAttributeInput':
      const path = error.path;
      // => "level"
      const payload = error.payload;
      // => { received: "not a number", expected: "number" }
      break;
      ...
    case 'entity.invalidSchema':
      const path = error.path; // ❌ error does not have path property
      const payload = error.payload; // ❌ same goes with payload
      ...
  }
};
```
