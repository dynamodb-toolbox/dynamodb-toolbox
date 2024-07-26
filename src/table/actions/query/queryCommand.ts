import type { ConsumedCapacity } from '@aws-sdk/client-dynamodb'
import { QueryCommand as _QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { QueryCommandInput, QueryCommandOutput } from '@aws-sdk/lib-dynamodb'
import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { FormattedItem } from '~/entity/actions/format/index.js'
import type { EntityPaths } from '~/entity/actions/parsePaths/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { CountSelectOption } from '~/options/select.js'
import { $entities, TableAction } from '~/table/index.js'
import type { Table } from '~/table/index.js'
import type { Merge } from '~/types/merge.js'
import { isString } from '~/utils/validation/isString.js'

import { $options, $query } from './constants.js'
import type { QueryOptions } from './options.js'
import { queryParams } from './queryParams/index.js'
import type { Query } from './types.js'

type ReturnedItems<
  TABLE extends Table,
  QUERY extends Query<TABLE>,
  ENTITIES extends Entity[],
  OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>
> = OPTIONS['select'] extends CountSelectOption
  ? undefined
  : (Entity[] extends ENTITIES
      ? FormattedItem
      : ENTITIES[number] extends infer ENTITY
        ? ENTITY extends Entity
          ? FormattedItem<
              ENTITY,
              {
                attributes: OPTIONS['attributes'] extends EntityPaths<ENTITY>[]
                  ? OPTIONS['attributes'][number]
                  : undefined
              }
            >
          : never
        : never)[]

export type QueryResponse<
  TABLE extends Table,
  QUERY extends Query<TABLE>,
  ENTITIES extends Entity[],
  OPTIONS extends QueryOptions<TABLE, ENTITIES>
> = Merge<
  Omit<QueryCommandOutput, 'Items' | '$metadata'>,
  {
    Items?: ReturnedItems<TABLE, QUERY, ENTITIES, OPTIONS>
    // $metadata is not returned on multiple page queries
    $metadata?: QueryCommandOutput['$metadata']
  }
>

export class QueryCommand<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  QUERY extends Query<TABLE> = Query<TABLE>,
  OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY> = QueryOptions<TABLE, ENTITIES, QUERY>
> extends TableAction<TABLE, ENTITIES> {
  static actionName = 'query' as const;

  [$query]?: QUERY;
  [$options]: OPTIONS

  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    query?: QUERY,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(table, entities)
    this[$query] = query
    this[$options] = options
  }

  entities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): QueryCommand<
    TABLE,
    NEXT_ENTITIES,
    QUERY,
    OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
      ? OPTIONS
      : QueryOptions<TABLE, NEXT_ENTITIES>
  > {
    return new QueryCommand<
      TABLE,
      NEXT_ENTITIES,
      QUERY,
      OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
        ? OPTIONS
        : QueryOptions<TABLE, NEXT_ENTITIES>
    >(
      this.table,
      nextEntities,
      this[$query],
      this[$options] as OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES>
        ? OPTIONS
        : QueryOptions<TABLE, NEXT_ENTITIES>
    )
  }

  query<NEXT_QUERY extends Query<TABLE>>(
    nextQuery: NEXT_QUERY
  ): QueryCommand<TABLE, ENTITIES, NEXT_QUERY, OPTIONS> {
    return new QueryCommand(this.table, this[$entities], nextQuery, this[$options])
  }

  options<NEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>>(
    nextOptions: NEXT_OPTIONS
  ): QueryCommand<TABLE, ENTITIES, QUERY, NEXT_OPTIONS> {
    return new QueryCommand(this.table, this[$entities], this[$query], nextOptions)
  }

  params = (): QueryCommandInput => {
    if (!this[$query]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'QueryCommand incomplete: Missing "query" property'
      })
    }

    return queryParams(this.table, this[$entities], this[$query], this[$options])
  }

  async send(): Promise<QueryResponse<TABLE, QUERY, ENTITIES, OPTIONS>> {
    const queryParams = this.params()

    const formatters: Record<string, EntityFormatter> = {}
    this[$entities].forEach(entity => {
      formatters[entity.name] = entity.build(EntityFormatter)
    })

    const formattedItems: FormattedItem[] = []
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
      } = await this.table.getDocumentClient().send(new _QueryCommand(pageQueryParams))

      for (const item of items) {
        const itemEntityName = item[this.table.entityAttributeSavedAs]

        if (!isString(itemEntityName)) {
          continue
        }

        const formatter = formatters[itemEntityName]

        if (formatter === undefined) {
          if (this[$entities].length === 0) {
            formattedItems.push(item)
          }
          continue
        }

        formattedItems.push(formatter.format(item, { attributes }))
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
      Items: formattedItems as QueryResponse<TABLE, QUERY, ENTITIES, OPTIONS>['Items'],
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
