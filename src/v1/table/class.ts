import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { Key, NarrowKey } from './types'

export class TableV2<
  PARTITION_KEY extends Key = Key,
  SORT_KEY extends Key = Key,
  ENTITY_NAME_ATTRIBUTE_SAVED_AS extends string = Key extends PARTITION_KEY ? string : '_et'
> {
  public documentClient: DynamoDBDocumentClient
  public name: string
  public partitionKey: PARTITION_KEY
  public sortKey?: SORT_KEY
  public entityNameAttributeSavedAs: ENTITY_NAME_ATTRIBUTE_SAVED_AS

  /**
   * Define a Table
   *
   * @param documentClient DynamoDBDocumentClient
   * @param name string
   * @param partitionKey Partition key
   * @param sortKey _(optional)_ Sort key
   * @param entityNameAttributeSavedAs _(optional)_ Entity name attribute savedAs (defaults to `'_et'`)
   */
  constructor({
    documentClient,
    name,
    partitionKey,
    sortKey,
    entityNameAttributeSavedAs = '_et' as ENTITY_NAME_ATTRIBUTE_SAVED_AS
  }: {
    documentClient: DynamoDBDocumentClient
    name: string
    partitionKey: NarrowKey<PARTITION_KEY>
    sortKey?: NarrowKey<SORT_KEY>
    entityNameAttributeSavedAs?: ENTITY_NAME_ATTRIBUTE_SAVED_AS
  }) {
    this.documentClient = documentClient
    this.name = name
    this.partitionKey = partitionKey
    if (sortKey) {
      this.sortKey = sortKey
    }
    this.entityNameAttributeSavedAs = entityNameAttributeSavedAs
  }
}
