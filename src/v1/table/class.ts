import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { TableOperation } from 'v1/operations/class'
import type { NarrowObject, NarrowObjectRec } from 'v1/types/narrowObject'
import { isString } from 'v1/utils/validation/isString'

import type { Index, Key } from './types'

export class TableV2<
  PARTITION_KEY extends Key = Key,
  SORT_KEY extends Key = Key,
  INDEXES extends Record<string, Index> = Key extends PARTITION_KEY ? Record<string, Index> : {},
  ENTITY_ATTRIBUTE_SAVED_AS extends string = Key extends PARTITION_KEY ? string : '_et'
> {
  public documentClient: DynamoDBDocumentClient
  public name: string | (() => string)
  public partitionKey: PARTITION_KEY
  public sortKey?: SORT_KEY
  public indexes: INDEXES
  public entityAttributeSavedAs: ENTITY_ATTRIBUTE_SAVED_AS

  public getName: () => string
  public build: <TABLE_OPERATION_CLASS extends TableOperation<this> = TableOperation<this>>(
    tableOperationClass: new (table: this) => TABLE_OPERATION_CLASS
  ) => TABLE_OPERATION_CLASS

  /**
   * Define a Table
   *
   * @param documentClient DynamoDBDocumentClient
   * @param name string
   * @param partitionKey Partition key
   * @param sortKey _(optional)_ Sort key
   * @param entityAttributeSavedAs _(optional)_ Entity name attribute savedAs (defaults to `'_et'`)
   */
  constructor({
    documentClient,
    name,
    partitionKey,
    sortKey,
    indexes = {} as INDEXES,
    entityAttributeSavedAs = '_et' as ENTITY_ATTRIBUTE_SAVED_AS
  }: {
    documentClient: DynamoDBDocumentClient
    name: string | (() => string)
    partitionKey: NarrowObject<PARTITION_KEY>
    sortKey?: NarrowObject<SORT_KEY>
    indexes?: NarrowObjectRec<INDEXES>
    entityAttributeSavedAs?: ENTITY_ATTRIBUTE_SAVED_AS
  }) {
    this.documentClient = documentClient
    this.name = name
    this.partitionKey = partitionKey
    if (sortKey) {
      this.sortKey = sortKey
    }
    this.indexes = indexes as INDEXES
    this.entityAttributeSavedAs = entityAttributeSavedAs

    this.getName = () => {
      if (isString(this.name)) {
        return this.name
      } else {
        return this.name()
      }
    }

    this.build = commandClass => new commandClass(this) as any
  }
}
