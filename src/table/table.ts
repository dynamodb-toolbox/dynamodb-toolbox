import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
import type { NarrowObject, NarrowObjectRec } from '~/types/narrowObject.js'
import { isString } from '~/utils/validation/isString.js'

import { $interceptor, $sentArgs } from './constants.js'
import { $entities } from './constants.js'
import type { Index, Key } from './types/index.js'

export class Table<
  PARTITION_KEY extends Key = Key,
  SORT_KEY extends Key = Key,
  INDEXES extends Record<string, Index> = Key extends PARTITION_KEY ? Record<string, Index> : {},
  ENTITY_ATTRIBUTE_SAVED_AS extends string = Key extends PARTITION_KEY ? string : '_et'
> {
  public documentClient?: DynamoDBDocumentClient
  public tableName?: string | (() => string)
  public partitionKey: PARTITION_KEY
  public sortKey?: SORT_KEY
  public indexes: INDEXES
  public entityAttributeSavedAs: ENTITY_ATTRIBUTE_SAVED_AS;

  [$interceptor]?: (action: TableSendableAction) => any

  constructor({
    documentClient,
    name,
    partitionKey,
    sortKey,
    indexes = {} as INDEXES,
    entityAttributeSavedAs = '_et' as ENTITY_ATTRIBUTE_SAVED_AS
  }: {
    documentClient?: DynamoDBDocumentClient
    name?: string | (() => string)
    partitionKey: NarrowObject<PARTITION_KEY>
    sortKey?: NarrowObject<SORT_KEY>
    indexes?: NarrowObjectRec<INDEXES>
    entityAttributeSavedAs?: ENTITY_ATTRIBUTE_SAVED_AS
  }) {
    this.documentClient = documentClient
    this.tableName = name
    this.partitionKey = partitionKey
    if (sortKey) {
      this.sortKey = sortKey
    }
    this.indexes = indexes as INDEXES
    this.entityAttributeSavedAs = entityAttributeSavedAs
  }

  getName(): string {
    if (this.tableName === undefined) {
      throw new DynamoDBToolboxError('table.missingTableName', {
        message: 'Please specify a table name in your Table constructor or in your command options.'
      })
    }

    if (isString(this.tableName)) {
      return this.tableName
    } else {
      return this.tableName()
    }
  }

  build<ACTION extends TableAction<this> = TableAction<this>>(
    Action: new (table: this) => ACTION
  ): ACTION {
    return new Action(this)
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

export class TableAction<TABLE extends Table = Table, ENTITIES extends Entity[] = Entity[]> {
  static actionName: string;

  [$entities]: ENTITIES

  constructor(
    public table: TABLE,
    entities = [] as unknown as ENTITIES
  ) {
    this[$entities] = entities
  }
}

export interface TableSendableAction<TABLE extends Table = Table> extends TableAction<TABLE> {
  [$sentArgs](): any[]
  send(documentClientOptions?: DocumentClientOptions): Promise<any>
}
