import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { IAccessPattern as IEntityAccessPattern } from '~/entity/actions/accessPattern/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { IAccessPattern as ITableAccessPattern } from '~/table/actions/accessPattern/index.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
import type { NarrowObject, NarrowObjectRec } from '~/types/narrowObject.js'
import { isString } from '~/utils/validation/isString.js'

import { $accessPatterns, $interceptor, $sentArgs } from './constants.js'
import { $entities } from './constants.js'
import type { Index, Key, TableMetadata } from './types/index.js'

export class Table<
  PARTITION_KEY extends Key = Key,
  SORT_KEY extends Key = Key,
  INDEXES extends Record<string, Index> = Key extends PARTITION_KEY ? Record<string, Index> : {},
  ENTITY_ATTRIBUTE_SAVED_AS extends string = Key extends PARTITION_KEY ? string : '_et'
> {
  documentClient?: DynamoDBDocumentClient
  tableName?: string | (() => string)
  readonly partitionKey: PARTITION_KEY
  readonly sortKey?: SORT_KEY
  readonly indexes: INDEXES
  readonly entityAttributeSavedAs: ENTITY_ATTRIBUTE_SAVED_AS;

  [$interceptor]?: (action: TableSendableAction) => any;
  [$entities]: Entity[]

  public meta: TableMetadata

  constructor({
    documentClient,
    /**
     * @debt v3 "To rename tableName"
     */
    name,
    partitionKey,
    sortKey,
    indexes = {} as INDEXES,
    entityAttributeSavedAs = '_et' as ENTITY_ATTRIBUTE_SAVED_AS,
    meta = {}
  }: {
    documentClient?: DynamoDBDocumentClient
    name?: string | (() => string)
    partitionKey: NarrowObject<PARTITION_KEY>
    sortKey?: NarrowObject<SORT_KEY>
    indexes?: NarrowObjectRec<INDEXES>
    entityAttributeSavedAs?: ENTITY_ATTRIBUTE_SAVED_AS
    meta?: TableMetadata
  }) {
    this.documentClient = documentClient
    this.tableName = name
    this.partitionKey = partitionKey
    if (sortKey) {
      this.sortKey = sortKey
    }
    this.indexes = indexes as INDEXES
    this.entityAttributeSavedAs = entityAttributeSavedAs
    this[$entities] = []
    this.meta = meta
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

  getDocumentClient = (): DynamoDBDocumentClient => {
    if (this.documentClient === undefined) {
      throw new DynamoDBToolboxError('actions.missingDocumentClient', {
        message: 'You need to set a document client on your table to send a command'
      })
    }

    return this.documentClient
  }

  build<ACTION extends TableAction<this, this[$entities]> = TableAction<this, this[$entities]>>(
    Action: new (table: this, entities?: this[$entities]) => ACTION
  ): ACTION {
    return new Action(this, this[$entities])
  }

  entities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): Table_<PARTITION_KEY, SORT_KEY, INDEXES, ENTITY_ATTRIBUTE_SAVED_AS, NEXT_ENTITIES> {
    return new Table_<PARTITION_KEY, SORT_KEY, INDEXES, ENTITY_ATTRIBUTE_SAVED_AS, NEXT_ENTITIES>(
      /**
       * @debt v3 "Just provide `this` once name is renamed to tableName"
       */
      {
        documentClient: this.documentClient,
        name: this.tableName,
        partitionKey: this.partitionKey,
        sortKey: this.sortKey,
        indexes: this.indexes,
        entityAttributeSavedAs: this.entityAttributeSavedAs,
        meta: this.meta
      },
      nextEntities
    )
  }
}

// NOTE: Need to be kept in the same file as Table to avoid circular dep
export class Table_<
  PARTITION_KEY extends Key = Key,
  SORT_KEY extends Key = Key,
  INDEXES extends Record<string, Index> = Key extends PARTITION_KEY ? Record<string, Index> : {},
  ENTITY_ATTRIBUTE_SAVED_AS extends string = Key extends PARTITION_KEY ? string : '_et',
  ENTITIES extends Entity[] = Entity[],
  ACCESS_PATTERNS extends Record<string, ITableAccessPattern | IEntityAccessPattern> = Record<
    string,
    ITableAccessPattern | IEntityAccessPattern
  >
> extends Table<PARTITION_KEY, SORT_KEY, INDEXES, ENTITY_ATTRIBUTE_SAVED_AS> {
  override [$entities]: ENTITIES;
  [$accessPatterns]: ACCESS_PATTERNS

  constructor(
    args: {
      documentClient?: DynamoDBDocumentClient
      name?: string | (() => string)
      partitionKey: NarrowObject<PARTITION_KEY>
      sortKey?: NarrowObject<SORT_KEY>
      indexes?: NarrowObjectRec<INDEXES>
      entityAttributeSavedAs?: ENTITY_ATTRIBUTE_SAVED_AS
      meta?: TableMetadata
    },
    entities = [] as unknown as ENTITIES,
    accessPatterns = {} as ACCESS_PATTERNS
  ) {
    super(args)
    this[$entities] = entities
    this[$accessPatterns] = accessPatterns
  }

  override entities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): Table_<
    PARTITION_KEY,
    SORT_KEY,
    INDEXES,
    ENTITY_ATTRIBUTE_SAVED_AS,
    NEXT_ENTITIES,
    ACCESS_PATTERNS
  > {
    return new Table_<
      PARTITION_KEY,
      SORT_KEY,
      INDEXES,
      ENTITY_ATTRIBUTE_SAVED_AS,
      NEXT_ENTITIES,
      ACCESS_PATTERNS
    >(
      /**
       * @debt v3 "Just provide `this` once name is renamed to tableName"
       */
      {
        documentClient: this.documentClient,
        name: this.tableName,
        partitionKey: this.partitionKey,
        sortKey: this.sortKey,
        indexes: this.indexes,
        entityAttributeSavedAs: this.entityAttributeSavedAs
      },
      nextEntities,
      this[$accessPatterns]
    )
  }

  accessPatterns<
    NEXT_ACCESS_PATTERNS extends Record<string, ITableAccessPattern | IEntityAccessPattern>
  >(
    nextAccessPatterns: NEXT_ACCESS_PATTERNS
  ): Table_<
    PARTITION_KEY,
    SORT_KEY,
    INDEXES,
    ENTITY_ATTRIBUTE_SAVED_AS,
    ENTITIES,
    NEXT_ACCESS_PATTERNS
  > {
    return new Table_<
      PARTITION_KEY,
      SORT_KEY,
      INDEXES,
      ENTITY_ATTRIBUTE_SAVED_AS,
      ENTITIES,
      NEXT_ACCESS_PATTERNS
    >(
      /**
       * @debt v3 "Just provide `this` once name is renamed to tableName"
       */
      {
        documentClient: this.documentClient,
        name: this.tableName,
        partitionKey: this.partitionKey,
        sortKey: this.sortKey,
        indexes: this.indexes,
        entityAttributeSavedAs: this.entityAttributeSavedAs
      },
      this[$entities],
      nextAccessPatterns
    )
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
