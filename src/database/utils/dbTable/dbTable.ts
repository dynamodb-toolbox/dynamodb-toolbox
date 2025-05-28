import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { $entities, $meta } from '~/table/constants.js'
import type { Table, TableAction } from '~/table/index.js'
import type { Table_ } from '~/table/index.js'
import type { TableMetadata } from '~/table/types/index.js'

import { $table } from '../../constants.js'
import { dbTableAccessPatterns, dbTableEntities, dbTableQuery } from './utils.js'
import type { DBTableAccessPatterns, DBTableEntities, DBTableQuery } from './utils.js'

export class DB<TABLE extends Table | Table_ = Table | Table_> {
  [$table]: TABLE
  entities: DBTableEntities<TABLE>
  accessPatterns: DBTableAccessPatterns<TABLE>
  query: DBTableQuery<TABLE>
  meta: TableMetadata

  // Original Table Props & methods
  readonly partitionKey: TABLE['partitionKey']
  readonly sortKey?: TABLE['sortKey']
  readonly indexes: TABLE['indexes']
  readonly entityAttributeSavedAs: TABLE['entityAttributeSavedAs']
  getName: TABLE['getName']
  getDocumentClient: TABLE['getDocumentClient']

  constructor(table: TABLE) {
    this[$table] = table
    this.entities = dbTableEntities(table)
    this.accessPatterns = dbTableAccessPatterns(table)
    this.query = dbTableQuery(table)
    this.meta = table[$meta]

    this.partitionKey = table.partitionKey
    this.sortKey = table.sortKey
    this.indexes = table.indexes
    this.entityAttributeSavedAs = table.entityAttributeSavedAs
    this.getName = table.getName
    this.getDocumentClient = table.getDocumentClient
  }

  set documentClient(documentClient: DynamoDBDocumentClient | undefined) {
    this[$table].documentClient = documentClient
  }

  get documentClient(): DynamoDBDocumentClient | undefined {
    return this[$table].documentClient
  }

  set tableName(tableName: string | (() => string) | undefined) {
    this[$table].tableName = tableName
  }

  get tableName(): string | (() => string) | undefined {
    return this[$table].tableName
  }

  build<
    ACTION extends TableAction<this[$table], this[$table][$entities]> = TableAction<
      this[$table],
      this[$table][$entities]
    >
  >(Action: new (table: this[$table], entities?: this[$table][$entities]) => ACTION): ACTION {
    return new Action(this[$table], this[$table][$entities])
  }
}
