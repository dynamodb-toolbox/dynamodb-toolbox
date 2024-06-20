import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { NarrowObject, NarrowObjectRec } from '~/types/narrowObject.js'
import { isString } from '~/utils/validation/isString.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { EntityV2 } from '~/entity/index.js'

import type { Index, Key } from './types/index.js'

export class TableV2<
  PARTITION_KEY extends Key = Key,
  SORT_KEY extends Key = Key,
  INDEXES extends Record<string, Index> = Key extends PARTITION_KEY ? Record<string, Index> : {},
  ENTITY_ATTRIBUTE_SAVED_AS extends string = Key extends PARTITION_KEY ? string : '_et'
> {
  public documentClient?: DynamoDBDocumentClient
  public name: string | (() => string)
  public partitionKey: PARTITION_KEY
  public sortKey?: SORT_KEY
  public indexes: INDEXES
  public entityAttributeSavedAs: ENTITY_ATTRIBUTE_SAVED_AS

  /**
   * Define a Table
   *
   * @param documentClient _(optional)_ DynamoDBDocumentClient
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
    documentClient?: DynamoDBDocumentClient
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
  }

  getName(): string {
    if (isString(this.name)) {
      return this.name
    } else {
      return this.name()
    }
  }

  build<TABLE_COMMAND_CLASS extends TableAction<this> = TableAction<this>>(
    commandClass: new (table: this) => TABLE_COMMAND_CLASS
  ): TABLE_COMMAND_CLASS {
    return new commandClass(this)
  }

  getDocumentClient = (): DynamoDBDocumentClient => {
    if (this.documentClient === undefined) {
      throw new DynamoDBToolboxError('actions.missingDocumentClient', {
        message: 'You need to set a document client on your table to send a command'
      })
    }

    return this.documentClient
  }
}

export const $table = Symbol('$table')
export type $table = typeof $table

export const $entities = Symbol('$entities')
export type $entities = typeof $entities

export class TableAction<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[]
> {
  static actionName: string;

  [$table]: TABLE;
  [$entities]: ENTITIES

  constructor(table: TABLE, entities = ([] as unknown) as ENTITIES) {
    this[$table] = table
    this[$entities] = entities
  }
}
