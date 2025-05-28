import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { $entities } from '~/table/constants.js'
import type { Table, TableAction, TableMetadata, Table_ } from '~/table/index.js'

import { $table } from '../../constants.js'
import type { DBTableAccessPatterns, DBTableEntities, DBTableQuery } from './utils.js'
import { dbTableAccessPatterns, dbTableEntities, dbTableQuery } from './utils.js'

export class DB<TABLE extends Table | Table_ = Table | Table_> {
  [$table]: TABLE
  entities: DBTableEntities<TABLE>
  accessPatterns: DBTableAccessPatterns<TABLE>
  query: DBTableQuery<TABLE>

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

    this.partitionKey = table.partitionKey
    this.sortKey = table.sortKey
    this.indexes = table.indexes
    this.entityAttributeSavedAs = table.entityAttributeSavedAs
    this.getName = table.getName
    this.getDocumentClient = table.getDocumentClient
  }

  get documentClient(): DynamoDBDocumentClient | undefined {
    return this[$table].documentClient
  }

  set documentClient(documentClient: DynamoDBDocumentClient | undefined) {
    this[$table].documentClient = documentClient
  }

  get tableName(): string | (() => string) | undefined {
    return this[$table].tableName
  }

  set tableName(tableName: string | (() => string) | undefined) {
    this[$table].tableName = tableName
  }

  get meta(): TableMetadata {
    return this[$table].meta
  }

  set meta(meta: TableMetadata) {
    this[$table].meta = meta
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
