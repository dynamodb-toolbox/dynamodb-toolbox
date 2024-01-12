import type { O } from 'ts-toolbelt'
import {
  QueryCommandInput,
  QueryCommand as _QueryCommand,
  QueryCommandOutput
} from '@aws-sdk/lib-dynamodb'
import type { ConsumedCapacity } from '@aws-sdk/client-dynamodb'
import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { TableV2 } from 'v1/table'
import type { EntityV2, FormattedItem } from 'v1/entity'
import type { Item } from 'v1/schema'
import type { CountSelectOption } from 'v1/operations/constants/options/select'
import type { AnyAttributePath, Query } from 'v1/operations/types'
import { formatSavedItem } from 'v1/operations/utils/formatSavedItem'
import { DynamoDBToolboxError } from 'v1/errors'
import { isString } from 'v1/utils/validation'

import { $entities, $table, TableOperation } from '../class'
import type { QueryOptions } from './options'
import { queryParams } from './queryParams'

const $query = Symbol('$query')
type $query = typeof $query

const $options = Symbol('$options')
type $options = typeof $options

type ReturnedItems<
  TABLE extends TableV2,
  ENTITIES extends EntityV2[],
  QUERY extends Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>
> = OPTIONS['select'] extends CountSelectOption
  ? undefined
  : (EntityV2[] extends ENTITIES
      ? Item
      : ENTITIES[number] extends infer ENTITY
      ? ENTITY extends EntityV2
        ? FormattedItem<
            ENTITY,
            {
              attributes: OPTIONS['attributes'] extends AnyAttributePath<ENTITY>[]
                ? OPTIONS['attributes'][number]
                : undefined
            }
          >
        : never
      : never)[]

export type QueryResponse<
  TABLE extends TableV2,
  ENTITIES extends EntityV2[],
  QUERY extends Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES>
> = O.Merge<
  Omit<QueryCommandOutput, 'Items' | '$metadata'>,
  {
    Items?: ReturnedItems<TABLE, ENTITIES, QUERY, OPTIONS>
    // $metadata is not returned on multiple page queries
    $metadata?: QueryCommandOutput['$metadata']
  }
>

export class QueryCommand<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[],
  QUERY extends Query<TABLE> = Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY> = QueryOptions<TABLE, ENTITIES, QUERY>
> extends TableOperation<TABLE, ENTITIES> {
  static operationName = 'query' as const

  entities: <NEXT_ENTITIES extends EntityV2[]>(
    ...nextEntities: NEXT_ENTITIES
  ) => QueryCommand<
    TABLE,
    NEXT_ENTITIES,
    QUERY,
    OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
      ? OPTIONS
      : QueryOptions<TABLE, NEXT_ENTITIES>
  >;

  [$query]?: QUERY
  query: <NEXT_QUERY extends Query<TABLE>>(
    query: NEXT_QUERY
  ) => QueryCommand<TABLE, ENTITIES, NEXT_QUERY, OPTIONS>;
  [$options]: OPTIONS
  options: <NEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>>(
    nextOptions: NEXT_OPTIONS
  ) => QueryCommand<TABLE, ENTITIES, QUERY, NEXT_OPTIONS>

  constructor(
    table: TABLE,
    entities = ([] as unknown) as ENTITIES,
    query?: QUERY,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(table, entities)
    this[$query] = query
    this[$options] = options

    this.entities = <NEXT_ENTITIES extends EntityV2[]>(...nextEntities: NEXT_ENTITIES) =>
      new QueryCommand<
        TABLE,
        NEXT_ENTITIES,
        QUERY,
        OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
          ? OPTIONS
          : QueryOptions<TABLE, NEXT_ENTITIES>
      >(
        this[$table],
        nextEntities,
        this[$query],
        this[$options] as OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
          ? OPTIONS
          : QueryOptions<TABLE, NEXT_ENTITIES>
      )
    this.query = nextQuery =>
      new QueryCommand(this[$table], this[$entities], nextQuery, this[$options])
    this.options = nextOptions =>
      new QueryCommand(this[$table], this[$entities], this[$query], nextOptions)
  }

  params = (): QueryCommandInput => {
    if (!this[$query]) {
      throw new DynamoDBToolboxError('operations.incompleteCommand', {
        message: 'QueryCommand incomplete: Missing "query" property'
      })
    }

    return queryParams(this[$table], this[$entities], this[$query], this[$options])
  }

  send = async (): Promise<QueryResponse<TABLE, ENTITIES, QUERY, OPTIONS>> => {
    const queryParams = this.params()

    const entities = this[$entities] ?? []
    const entitiesByName: Record<string, EntityV2> = {}
    entities.forEach(entity => {
      entitiesByName[entity.name] = entity
    })

    const formattedItems: Item[] = []
    let lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined = undefined
    let count: number | undefined = 0
    let scannedCount: number | undefined = 0
    let consumedCapacity: ConsumedCapacity | undefined = undefined
    let responseMetadata: QueryCommandOutput['$metadata'] | undefined = undefined

    // NOTE: maxPages has been validated by this.params()
    const { attributes, maxPages = 1 } = this[$options]
    let pageIndex = 0
    do {
      pageIndex += 1

      const pageQueryParams: QueryCommandInput = {
        ...queryParams,
        // NOTE: Important NOT to override initial exclusiveStartKey on first page
        ...(lastEvaluatedKey !== undefined ? { ExclusiveStartKey: lastEvaluatedKey } : {})
      }

      const {
        Items: items = [],
        LastEvaluatedKey: pageLastEvaluatedKey,
        Count: pageCount,
        ScannedCount: pageScannedCount,
        ConsumedCapacity: pageConsumedCapacity,
        $metadata: pageMetadata
      } = await this[$table].documentClient.send(new _QueryCommand(pageQueryParams))

      for (const item of items) {
        const itemEntityName = item[this[$table].entityAttributeSavedAs]

        if (!isString(itemEntityName)) {
          continue
        }

        const itemEntity = entitiesByName[itemEntityName]

        if (itemEntity === undefined) {
          continue
        }

        formattedItems.push(
          formatSavedItem<EntityV2, {}>(itemEntity, item, { attributes })
        )
      }

      lastEvaluatedKey = pageLastEvaluatedKey

      if (count !== undefined) {
        count = pageCount !== undefined ? count + pageCount : undefined
      }

      if (scannedCount !== undefined) {
        scannedCount = pageScannedCount !== undefined ? scannedCount + pageScannedCount : undefined
      }

      consumedCapacity = pageConsumedCapacity
      responseMetadata = pageMetadata
    } while (pageIndex < maxPages && lastEvaluatedKey !== undefined)

    return {
      Items: formattedItems as QueryResponse<TABLE, ENTITIES, QUERY, OPTIONS>['Items'],
      ...(lastEvaluatedKey !== undefined ? { LastEvaluatedKey: lastEvaluatedKey } : {}),
      ...(count !== undefined ? { Count: count } : {}),
      ...(scannedCount !== undefined ? { ScannedCount: scannedCount } : {}),
      // return ConsumedCapacity & $metadata only if one page has been fetched
      ...(pageIndex === 1
        ? {
            ...(consumedCapacity !== undefined ? { ConsumedCapacity: consumedCapacity } : {}),
            ...(responseMetadata !== undefined ? { $metadata: responseMetadata } : {})
          }
        : {})
    }
  }
}

export type QueryCommandClass = typeof QueryCommand
