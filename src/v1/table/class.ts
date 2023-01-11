import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { Key, NarrowKey } from './types'

export class TableV2<PARTITION_KEY extends Key = Key, SORT_KEY extends Key = Key> {
  public documentClient: DynamoDBDocumentClient
  public name: string
  public partitionKey: PARTITION_KEY
  public sortKey?: SORT_KEY

  /**
   * Define a Table
   * (TODO: Use @typedef for constructor arguments, see https://stackoverflow.com/questions/58410776/how-to-document-destructured-parameters-in-jsdoc)
   *
   * @param documentClient DynamoDBDocumentClient
   * @param name string
   * @param partitionKey Partition key
   * @param sortKey _(optional)_ Sort key
   */
  constructor({
    documentClient,
    name,
    partitionKey,
    sortKey
  }: {
    documentClient: DynamoDBDocumentClient
    name: string
    partitionKey: NarrowKey<PARTITION_KEY>
    sortKey?: NarrowKey<SORT_KEY>
  }) {
    this.documentClient = documentClient
    this.name = name
    this.partitionKey = partitionKey
    if (sortKey) {
      this.sortKey = sortKey
    }
  }
}
