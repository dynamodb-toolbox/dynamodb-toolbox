import type { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { Key, NarrowKey } from './types'

export class TableV2<PK extends Key = Key, SK extends Key = Key> {
  public dynamoDbClient: DynamoDBClient
  public name: string
  public partitionKey: PK
  public sortKey?: SK

  /**
   * Define a Table
   * (TODO: Use @typedef for constructor arguments, see https://stackoverflow.com/questions/58410776/how-to-document-destructured-parameters-in-jsdoc)
   *
   * @param dynamoDbClient DynamoDBClient
   * @param name string
   * @param partitionKey Partition key
   * @param sortKey _(optional)_ Sort key
   */
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
