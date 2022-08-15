import type { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { Key, NarrowKey } from './types'

export class TableV2<PK extends Key = Key, SK extends Key = Key> {
  public dynamoDbClient: DynamoDBClient
  public name: string
  public partitionKey: PK
  public sortKey?: SK

  constructor({
    dynamoDbClient,
    name,
    partitionKey,
    sortKey
  }: {
    dynamoDbClient: DynamoDBClient
    name: string
    partitionKey: NarrowKey<PK>
    sortKey?: NarrowKey<SK>
  }) {
    this.dynamoDbClient = dynamoDbClient
    this.name = name
    this.partitionKey = partitionKey
    if (sortKey) {
      this.sortKey = sortKey
    }
  }
}
