---
title: Synchronize
sidebar_custom_props:
  sidebarActionType: pro
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Synchronize

Uploads your `Table` and `Entities` configurations to [DynamoDB-Toolshack](https://dynamodb-toolshack.com):

```ts
import { Synchronizer } from 'dynamodb-toolbox/table/actions/synchronize'

await PokeTable.build(Synchronizer)
  .entities(PokemonEntity, TrainerEntity)
  .sync({ apiKey: '<YOUR_API_KEY_HERE>' })
```

## Request

### `.awsConfig(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The AWS AccountId and Region of the `Table`:

```ts
await PokeTable.build(Synchronizer)
  .awsConfig({
    awsAccountId: '398259209128',
    awsRegion: 'us-east-1'
  })
  .sync(...)
```

### `.entities(...)`

A list of `Entities` to upload for the `Table`:

```ts
await PokeTable.build(Synchronizer)
  .awsConfig(...)
  .entities(PokemonEntity, TrainerEntity)
  .sync(...)
```

### `.accessRole(...)`

An optional access IAM Role for the `Table`:

```ts
await PokeTable.build(Synchronizer)
  .awsConfig(...)
  .accessRole({
    roleName: 'DynamoDBToolshackAccountAccessRole',
    description: 'Optional role description'
  })
```

### `.metadata(...)`

Enables providing DynamoDB-Toolshack metadata for your AWS account, `Table` and `Entities`:

```ts
await PokeTable.build(Synchronizer)
  .awsConfig(...)
  .entities(PokemonEntity, TrainerEntity)
  .metadata({
    awsAccountTitle: 'Dev',
    // 👇 https://ui.shadcn.com/colors
    awsAccountColor: 'blue',
    awsAccountDescription: 'Account for development purposes',
    // 👇 https://lucide.dev/icons/
    tableIcon: 'database-zap',
    tableTitle: 'Pokedex',
    tableDescription: 'An Awesome Table for development use',
    entities: {
      // 👇 Provide metadata for each entity
      [PokemonEntity.name]: {
        // 👇 https://lucide.dev/icons/
        entityIcon: 'cat',
        entityTitle: 'Pokemon',
        entityDescription: 'An Awesome Entity for development use'
      },
      ...
    }
  })
  .sync(...)
```

### `.sync(...)`

Uploads the configuration to [DynamoDB-Toolshack](https://dynamodb-toolshack.com):

```ts
await PokeTable.build(Synchronizer)
  .awsConfig(...)
  .sync({
    // 👇 https://app.dynamodb-toolshack.com/api-keys
    apiKey: '<API_KEY>',
    // 👇 (optional) Keep only specified entities (`false` by default)
    deleteUnknownEntities: true,
    // 👇 (optional) Override Table instance name
    tableName: 'my-table-name'
  })
```

<!-- :::note

Please read the [Reference](https://dynamodb-toolshack.com/reference) for more details on the DynamoDB-Toolshack API.

::: -->
