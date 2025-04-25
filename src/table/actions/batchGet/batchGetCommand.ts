import type { BatchGetCommandInput } from '@aws-sdk/lib-dynamodb'

import type { BatchGetRequest } from '~/entity/actions/batchGet/index.js'
import type { EntityPathsIntersection } from '~/entity/actions/parsePaths/index.js'
import { EntityPathParser } from '~/entity/actions/parsePaths/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseConsistentOption } from '~/options/consistent.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseTableNameOption } from '~/options/tableName.js'
import type { Table } from '~/table/index.js'
import { $entities, TableAction } from '~/table/index.js'
import type { ListOf } from '~/types/listOf.js'
import { isEmpty } from '~/utils/isEmpty.js'

import { $options, $requests } from './constants.js'

export type IBatchGetRequest = Pick<BatchGetRequest, 'entity' | 'params'>

export type BatchGetCommandOptions<ENTITIES extends Entity[] = Entity[]> = {
  consistent?: boolean
  tableName?: string
  // For some reason, this union is required to keep the strict type of `options.attributes`
  // when building a `BatchGetCommand` directly inside `execute`:
  // => execute(TestTable1.build(BatchGetCommand).requests(...).options({ attributes: ['attr'] }))
} & ({ attributes?: undefined } | { attributes: EntityPathsIntersection<ENTITIES>[] })

export type RequestEntities<
  REQUESTS extends IBatchGetRequest[],
  RESULTS extends Entity[] = []
> = number extends REQUESTS['length']
  ? ListOf<REQUESTS[number]> extends IBatchGetRequest[]
    ? RequestEntities<ListOf<REQUESTS[number]>>
    : never
  : REQUESTS extends [infer REQUESTS_HEAD, ...infer REQUESTS_TAIL]
    ? REQUESTS_HEAD extends IBatchGetRequest
      ? REQUESTS_TAIL extends IBatchGetRequest[]
        ? REQUESTS_HEAD['entity']['entityName'] extends RESULTS[number]['entityName']
          ? RequestEntities<REQUESTS_TAIL, RESULTS>
          : RequestEntities<REQUESTS_TAIL, [...RESULTS, REQUESTS_HEAD['entity']]>
        : never
      : never
    : RESULTS

export class BatchGetCommand<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  REQUESTS extends IBatchGetRequest[] = IBatchGetRequest[],
  OPTIONS extends BatchGetCommandOptions<ENTITIES> = BatchGetCommandOptions<ENTITIES>
> extends TableAction<TABLE, ENTITIES> {
  static override actionName = 'batchGet' as const;

  [$requests]?: REQUESTS;
  [$options]: OPTIONS

  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    requests?: REQUESTS,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(table, entities)
    this[$requests] = requests
    this[$options] = options
  }

  requests<NEXT_REQUESTS extends IBatchGetRequest[]>(
    ...requests: NEXT_REQUESTS
  ): BatchGetCommand<
    TABLE,
    RequestEntities<NEXT_REQUESTS>,
    NEXT_REQUESTS,
    OPTIONS extends BatchGetCommandOptions<RequestEntities<NEXT_REQUESTS>>
      ? OPTIONS
      : BatchGetCommandOptions<RequestEntities<NEXT_REQUESTS>>
  > {
    const entities: Entity[] = []
    const entityNames = new Set<string>()

    for (const request of requests) {
      if (entityNames.has(request.entity.entityName)) {
        continue
      }
      entities.push(request.entity)
      entityNames.add(request.entity.entityName)
    }

    return new BatchGetCommand(
      this.table,
      entities as RequestEntities<NEXT_REQUESTS>,
      requests,
      this[$options] as OPTIONS extends BatchGetCommandOptions<RequestEntities<NEXT_REQUESTS>>
        ? OPTIONS
        : BatchGetCommandOptions<RequestEntities<NEXT_REQUESTS>>
    )
  }

  options<NEXT_OPTIONS extends BatchGetCommandOptions<ENTITIES>>(
    nextOptions: NEXT_OPTIONS
  ): BatchGetCommand<TABLE, ENTITIES, REQUESTS, NEXT_OPTIONS> {
    return new BatchGetCommand(this.table, this[$entities], this[$requests], nextOptions)
  }

  params(): NonNullable<BatchGetCommandInput['RequestItems']> {
    const requests = this[$requests] ?? []
    const firstRequest = requests[0]
    if (firstRequest === undefined) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchGetCommand incomplete: No BatchGetRequest supplied'
      })
    }

    const firstRequestEntity = firstRequest.entity

    const { consistent, attributes: _attributes, tableName, ...extraOptions } = this[$options] ?? {}
    rejectExtraOptions(extraOptions)

    if (tableName) {
      parseTableNameOption(tableName)
    }

    const attributes = _attributes as [string, ...string[]] | undefined
    let projectionExpression: string | undefined = undefined
    const expressionAttributeNames: Record<string, string> = {}

    /**
     * @debt feature "For now, we compute the projectionExpression using the first entity. To improve."
     */
    if (attributes !== undefined && attributes.length > 0) {
      const { ExpressionAttributeNames: projectionAttributeNames, ProjectionExpression } =
        firstRequestEntity.build(EntityPathParser).parse(attributes)

      Object.assign(expressionAttributeNames, projectionAttributeNames)
      projectionExpression = ProjectionExpression

      const { partitionKey, sortKey, entityAttributeSavedAs } = this.table
      const filteredAttributes = new Set<string>(Object.values(expressionAttributeNames))

      // table partitionKey and sortKey are required at all times for response re-ordering
      if (!filteredAttributes.has(partitionKey.name)) {
        projectionExpression += `, #_pk`
        expressionAttributeNames['#_pk'] = partitionKey.name
      }

      if (sortKey !== undefined && !filteredAttributes.has(sortKey.name)) {
        projectionExpression += `, #_sk`
        expressionAttributeNames['#_sk'] = sortKey.name
      }

      // We prefer including the entityAttrSavedAs for faster formatting
      if (!filteredAttributes.has(entityAttributeSavedAs)) {
        projectionExpression += `, #_et`
        expressionAttributeNames['#_et'] = entityAttributeSavedAs
      }
    }

    const keys: Record<string, any>[] = []

    for (const request of requests) {
      const key = request.params()
      keys.push(key)
    }

    return {
      [tableName ?? this.table.getName()]: {
        Keys: keys,
        ...(consistent !== undefined ? { ConsistentRead: parseConsistentOption(consistent) } : {}),
        ...(projectionExpression !== undefined
          ? { ProjectionExpression: projectionExpression }
          : {}),
        ...(!isEmpty(expressionAttributeNames)
          ? { ExpressionAttributeNames: expressionAttributeNames }
          : {})
      }
    }
  }
}
