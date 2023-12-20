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
import type { CountSelectOption } from 'v1/commands/constants/options/select'
import type { AnyAttributePath, Query } from 'v1/commands/types'
import { formatSavedItem } from 'v1/commands/utils/formatSavedItem'
import { DynamoDBToolboxError } from 'v1/errors'
import { isString } from 'v1/utils/validation'

import { TableCommand } from '../class'
import type { QueryOptions } from './options'
import { queryParams } from './queryParams'

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
> extends TableCommand<TABLE, ENTITIES> {
  static commandName = 'query' as const

  public entities: <NEXT_ENTITIES extends EntityV2[]>(
    ...nextEntities: NEXT_ENTITIES
  ) => QueryCommand<
    TABLE,
    NEXT_ENTITIES,
    QUERY,
    OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
      ? OPTIONS
      : QueryOptions<TABLE, NEXT_ENTITIES>
  >

  public _query?: QUERY
  public query: <NEXT_QUERY extends Query<TABLE>>(
    query: NEXT_QUERY
  ) => QueryCommand<TABLE, ENTITIES, NEXT_QUERY, OPTIONS>
  public _options: OPTIONS
  public options: <NEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>>(
    nextOptions: NEXT_OPTIONS
  ) => QueryCommand<TABLE, ENTITIES, QUERY, NEXT_OPTIONS>

  constructor(
    args: { table: TABLE; entities?: ENTITIES },
    query?: QUERY,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(args)
    this._query = query
    this._options = options

    this.entities = <NEXT_ENTITIES extends EntityV2[]>(...nextEntities: NEXT_ENTITIES) =>
      new QueryCommand<
        TABLE,
        NEXT_ENTITIES,
        QUERY,
        OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
          ? OPTIONS
          : QueryOptions<TABLE, NEXT_ENTITIES>
      >(
        {
          table: this._table,
          entities: nextEntities
        },
        this._query,
        this._options as OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
          ? OPTIONS
          : QueryOptions<TABLE, NEXT_ENTITIES>
      )
    this.query = nextQuery =>
      new QueryCommand({ table: this._table, entities: this._entities }, nextQuery, this._options)
    this.options = nextOptions =>
      new QueryCommand({ table: this._table, entities: this._entities }, this._query, nextOptions)
  }

  params = (): QueryCommandInput => {
    if (!this._query) {
      throw new DynamoDBToolboxError('commands.incompleteCommand', {
        message: 'QueryCommand incomplete: Missing "query" property'
      })
    }

    return queryParams({ table: this._table, entities: this._entities }, this._query, this._options)
  }

  send = async (): Promise<QueryResponse<TABLE, ENTITIES, QUERY, OPTIONS>> => {
    const queryParams = this.params()

    const entities = this._entities ?? []
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
    const { attributes, maxPages = 1 } = this._options
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
      } = await this._table.documentClient.send(new _QueryCommand(pageQueryParams))

      for (const item of items) {
        const itemEntityName = item[this._table.entityAttributeSavedAs]

        if (!isString(itemEntityName)) {
          continue
        }

        const itemEntity = entitiesByName[itemEntityName]

        if (itemEntity === undefined) {
          continue
        }

        formattedItems.push(formatSavedItem<EntityV2, {}>(itemEntity, item, { attributes }))
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
