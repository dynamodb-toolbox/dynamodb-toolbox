import type { default as DynamoDb, DocumentClient } from 'aws-sdk/clients/dynamodb'
import type { A, O } from 'ts-toolbelt'

import type { ProjectionAttributes } from '../../lib/projectionBuilder'
import type { FilterExpressions } from '../../lib/expressionBuilder'
import type { $ReadOptions, ConditionsOrFilters } from '../Entity'
import type Table from './Table'

export interface TableConstructor<
  Name extends string,
  PartitionKey extends A.Key,
  SortKey extends A.Key | null
> {
  name: Name
  alias?: string | null
  partitionKey: PartitionKey
  sortKey?: SortKey
  entityField?: boolean | string
  attributes?: TableAttributes
  indexes?: TableIndexes
  autoExecute?: boolean
  autoParse?: boolean
  DocumentClient?: DynamoDb.DocumentClient
  entities?: {} // improve - not documented
  removeNullAttributes?: boolean
}

export type DynamoDBTypes = 'string' | 'boolean' | 'number' | 'list' | 'map' | 'binary' | 'set'
export type DynamoDBKeyTypes = 'string' | 'number' | 'binary'

export interface executeParse {
  execute?: boolean
  parse?: boolean
}

export interface TableAttributeConfig {
  type: DynamoDBTypes
  setType?: DynamoDBKeyTypes
}

export interface TableAttributes {
  [attr: string]: DynamoDBTypes | TableAttributeConfig
}

export interface ParsedTableAttribute {
  [attr: string]: TableAttributeConfig & { mappings: {} }
}

export interface TableIndexes {
  [index: string]: { partitionKey?: string; sortKey?: string }
}

export type TableReadOptions = { index: string; limit: number; entity: string }

export type $QueryOptions<
  Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined
> = $ReadOptions<Execute, Parse> &
  TableReadOptions & {
    reverse: boolean
    select: DocumentClient.Select
    // 🔨 TOIMPROVE: Probably typable (should be the same as sort key)
    eq: string | number
    lt: string | number
    lte: string | number
    gt: string | number
    gte: string | number
    between: [string, string] | [number, number]
    beginsWith: string
    startKey: {}
  }

export type TableQueryOptions<
  Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined
> = O.Partial<
  $QueryOptions<Execute, Parse> & {
    attributes: ProjectionAttributes
    filters: ConditionsOrFilters<A.Key>
  }
>

export type ScanOptions<
  Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined
> = O.Partial<
  $ReadOptions<Execute, Parse> &
    TableReadOptions & {
      attributes?: ProjectionAttributes
      filters?: FilterExpressions
      startKey?: {}
      segments?: number
      segment?: number
      capacity?: DocumentClient.ReturnConsumedCapacity
      select?: DocumentClient.Select
    }
>

export interface BatchGetOptions {
  consistent?: boolean | { [tableName: string]: boolean }
  capacity?: DocumentClient.ReturnConsumedCapacity
  attributes?: ProjectionAttributes
  include?: string[]
  execute?: boolean
  parse?: boolean
}

export interface BatchGetParamsMeta {
  payload: any
  Tables: { [key: string]: TableDef }
  EntityProjections: { [key: string]: any }
  TableProjections: { [key: string]: string[] }
}

export interface batchWriteOptions {
  capacity?: DocumentClient.ReturnConsumedCapacity
  metrics?: DocumentClient.ReturnItemCollectionMetrics
  execute?: boolean
  parse?: boolean
}

export interface transactGetParamsOptions {
  capacity?: DocumentClient.ReturnConsumedCapacity
}

export type transactGetOptions = transactGetParamsOptions & executeParse

export interface transactWriteParamsOptions {
  capacity?: DocumentClient.ReturnConsumedCapacity
  metrics?: DocumentClient.ReturnItemCollectionMetrics
  token?: string
}

export type TransactWriteOptions = transactWriteParamsOptions & executeParse

export interface TransactGetParamsMeta {
  Entities: (any | undefined)[]
  payload: DocumentClient.TransactGetItemsInput
}

export type TableDef = Table<string, A.Key, A.Key | null>
