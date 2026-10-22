---
title: Synchronize
sidebar_custom_props:
  sidebarActionType: pro
---

# Synchronizer

Uploads your `Database` configuration to [DynamoDB-Toolshack](https://dynamodb-toolshack.com):

```ts
import { Synchronizer } from 'dynamodb-toolbox/database/actions/synchronize'

await pokeDB
  .build(Synchronizer)
  .awsAccount({
    awsAccountId: '398259209128',
    awsRegion: 'us-east-1'
  })
  .sync({ apiKey: '<YOUR_API_KEY_HERE>' })
```

## Request

### `.awsAccount(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

Defines the AWS `accountId` and `region` associated with the `Database`. You can optionally include metadata:

```ts
await PokeTable.build(Synchronizer)
  .awsAccount({
    awsAccountId: '398259209128',
    awsRegion: 'us-east-1',
    // 👇 Optional metadata
    title: 'Dev',
    description: 'Development environment account',
    // 👇 https://ui.shadcn.com/colors
    color: 'blue'
  })
  .sync(...)
```

## Methods

### `.sync(...)`

Uploads the configuration to [DynamoDB-Toolshack](https://dynamodb-toolshack.com):

```ts
await PokeTable.build(Synchronizer)
  .awsAccount(...)
  .sync({
    // 👇 https://app.dynamodb-toolshack.com/api-keys
    apiKey: '<API_KEY>',
    // 👇 (optional) Keep only specified entities (`false` by default)
    deleteUnknownEntities: true,
    // 👇 (optional) Keep only specified tables (`false` by default)
    deleteUnknownTables: true,
  })
```

## Adding Metadata

Additional DynamoDB-Toolshack metadata—such as Table and Entity titles, descriptions, and icons—can be defined directly inside the `meta` property of each Table and Entity.

### Table

Use the standard [metadata fields](../../../2-tables/1-usage/index.md#meta) to define a Table’s `title` and `description`. You can customize the `icon` and `accessRole` attributes under the `_ddbToolshack` key:

```ts
export const PokeTable = new Table({
  ...
  meta: {
    title: 'Pokedex',
    description: 'An Awesome Table for development use',
    _ddbToolshack: {
      // 👇 https://lucide.dev/icons/
      icon: 'database-zap',
      accessRole: {
        roleName: 'DynamoDBToolshackAccountAccessRole',
        description: 'Optional role description'
      }
    }
  }
})
```

### Entity

Use the standard [metadata fields](../../../3-entities/1-usage/index.md#meta) to define an Entity's `title` and `description`. You can customize the `icon` attribute under the `_ddbToolshack` key:

```ts
export const PokemonEntity = new Entity({
  ...
  meta: {
    title: 'Pokemon',
    description: 'An Awesome Entity for development use',
    _ddbToolshack: {
      // 👇 https://lucide.dev/icons/
      icon: 'cat'
    }
  }
})
```
