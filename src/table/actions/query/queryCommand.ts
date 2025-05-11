import type { ConsumedCapacity } from '@aws-sdk/client-dynamodb'
import type { QueryCommandInput, QueryCommandOutput } from '@aws-sdk/lib-dynamodb'
import { QueryCommand as _QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { EntityPaths } from '~/entity/actions/parsePaths/index.js'
import type { Entity, FormattedItem } from '~/entity/index.js'
import { getEntityAttrOptionValue, isEntityAttrEnabled } from '~/entity/utils/index.js'
import type { EntityAttrObjectOptions, EntityAttrOptionValue } from '~/entity/utils/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { CountSelectOption } from '~/options/select.js'
import { $sentArgs } from '~/table/constants.js'
import { interceptable } from '~/table/decorator.js'
import { $entities, TableAction } from '~/table/index.js'
import type { Table, TableSendableAction } from '~/table/table.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
import type { Merge } from '~/types/merge.js'
import { isString } from '~/utils/validation/isString.js'

import { $entity, $options, $query } from './constants.js'
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
          ? [ENTITY, OPTIONS] extends [
              { entityAttribute: true | EntityAttrObjectOptions },
              { showEntityAttr: true }
            ]
            ? Merge<
                FormattedItem<
                  ENTITY,
                  {
                    attributes: OPTIONS extends { attributes: string[] }
                      ? Extract<OPTIONS['attributes'][number], EntityPaths<ENTITY>>
                      : undefined
                  }
                >,
                {
                  [KEY in EntityAttrOptionValue<
                    ENTITY['entityAttribute'],
                    'name'
                  >]: ENTITY['entityName']
                }
              >
            : FormattedItem<
                ENTITY,
                {
                  attributes: OPTIONS extends { attributes: string[] }
                    ? Extract<OPTIONS['attributes'][number], EntityPaths<ENTITY>>
                    : undefined
                }
              >
          : never
        : never)[]

export type QueryResponse<
  TABLE extends Table,
  QUERY extends Query<TABLE>,
  ENTITIES extends Entity[],
  OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>
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
  >
  extends TableAction<TABLE, ENTITIES>
  implements TableSendableAction<TABLE>
{
  static override actionName = 'query' as const;

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
    OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
      ? OPTIONS
      : QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
  > {
    return new QueryCommand(
      this.table,
      nextEntities,
      this[$query],
      this[$options] as OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
        ? OPTIONS
        : QueryOptions<TABLE, NEXT_ENTITIES, QUERY>
    )
  }

  query<NEXT_QUERY extends Query<TABLE>>(
    nextQuery: NEXT_QUERY
  ): QueryCommand<
    TABLE,
    ENTITIES,
    NEXT_QUERY,
    OPTIONS extends QueryOptions<TABLE, ENTITIES, NEXT_QUERY>
      ? OPTIONS
      : QueryOptions<TABLE, ENTITIES, NEXT_QUERY>
  > {
    return new QueryCommand(
      this.table,
      this[$entities],
      nextQuery,
      this[$options] as OPTIONS extends QueryOptions<TABLE, ENTITIES, NEXT_QUERY>
        ? OPTIONS
        : QueryOptions<TABLE, ENTITIES, NEXT_QUERY>
    )
  }

  options<NEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY>>(
    nextOptions: NEXT_OPTIONS
  ): QueryCommand<TABLE, ENTITIES, QUERY, NEXT_OPTIONS> {
    return new QueryCommand(this.table, this[$entities], this[$query], nextOptions)
  }

  [$sentArgs](): [Entity[], Query<TABLE>, QueryOptions<TABLE, Entity[], Query<TABLE>>] {
    if (!this[$query]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'QueryCommand incomplete: Missing "query" property'
      })
    }

    return [
      this[$entities],
      this[$query],
      /**
       * @debt type "Make any QueryOptions<...> instance extend base QueryOptions"
       */
      this[$options] as QueryOptions<TABLE, Entity[], Query<TABLE>>
    ]
  }

  params = (): QueryCommandInput => {
    return queryParams(this.table, ...this[$sentArgs]())
  }

  @interceptable()
  async send(
    documentClientOptions?: DocumentClientOptions
  ): Promise<QueryResponse<TABLE, QUERY, ENTITIES, OPTIONS>> {
    const entityAttrSavedAs = this.table.entityAttributeSavedAs
    const queryParams = this.params()

    const formattersByName: Record<string, EntityFormatter> = {}
    this[$entities].forEach(entity => {
      formattersByName[entity.entityName] = entity.build(EntityFormatter)
    })

    const formattedItems: FormattedItem[] = []
    let lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined = undefined
    let count: number | undefined = 0
    let scannedCount: number | undefined = 0
    let consumedCapacity: ConsumedCapacity | undefined = undefined
    let responseMetadata: QueryCommandOutput['$metadata'] | undefined = undefined

    const {
      attributes,
      maxPages = 1,
      showEntityAttr = false,
      tagEntities = false,
      noEntityMatchBehavior = 'THROW'
    } = this[$options]

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
      } = await this.table
        .getDocumentClient()
        .send(new _QueryCommand(pageQueryParams), documentClientOptions)

      for (const item of items) {
        if (this[$entities].length === 0) {
          formattedItems.push(item)
          continue
        }

        const itemEntityName = item[entityAttrSavedAs] as unknown
        const itemEntityFormatter = formattersByName[String(itemEntityName)]

        if (!isString(itemEntityName) || itemEntityFormatter === undefined) {
          let hasEntityMatch: boolean = false

          // If data doesn't contain entity name (e.g. migrating to DynamoDB-Toolbox), we try all formatters
          // (NOTE: Can only happen if `entityAttrFilter` is false)
          for (const [entityName, formatter] of Object.entries(formattersByName)) {
            try {
              const formattedItem = formatter.format(item, { attributes })

              const { entityAttribute } = formatter.entity
              const entityAttrName = getEntityAttrOptionValue(entityAttribute, 'name')
              const addEntityAttr = showEntityAttr && isEntityAttrEnabled(entityAttribute)

              formattedItems.push({
                ...formattedItem,
                ...(addEntityAttr ? { [entityAttrName]: entityName } : {}),
                // $entity symbol is useful for the DeletePartition command
                ...(tagEntities ? { [$entity]: entityName } : {})
              })

              hasEntityMatch = true
              break
            } catch {
              continue
            }
          }

          if (!hasEntityMatch && noEntityMatchBehavior === 'THROW') {
            throw new DynamoDBToolboxError('queryCommand.noEntityMatched', {
              message: 'Unable to match item of unidentified entity to the QueryCommand entities',
              payload: { item }
            })
          }

          continue
        }

        const formattedItem = itemEntityFormatter.format(item, { attributes })

        const { entityAttribute, entityName } = itemEntityFormatter.entity
        const entityAttrName = getEntityAttrOptionValue(entityAttribute, 'name')
        const addEntityAttr = showEntityAttr && isEntityAttrEnabled(entityAttribute)

        formattedItems.push({
          ...formattedItem,
          ...(addEntityAttr ? { [entityAttrName]: entityName } : {}),
          // $entity symbol is useful for the DeletePartition command
          ...(tagEntities ? { [$entity]: entityName } : {})
        })
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
