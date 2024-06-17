import type { BatchGetCommandInput } from '@aws-sdk/lib-dynamodb'
import { isEmpty } from 'lodash'

import { DynamoDBToolboxError } from 'v1/errors'
import { parseConsistentOption } from 'v1/options/consistent'
import { TableV2, TableAction, $table, $entities } from 'v1/table'
import { $entity, EntityV2 } from 'v1/entity'
import { EntityPathParser, EntityPathsIntersection } from 'v1/entity/actions/parsePaths'
import type { BatchGetItemRequest, $key } from 'v1/entity/actions/batchGet'

const $requests = Symbol('$requests')
type $requests = typeof $requests

const $options = Symbol('$options')
type $options = typeof $options

type BatchGetItemRequestProps = Pick<BatchGetItemRequest, $entity | $key | 'params'>

export type BatchGetTableItemsOptions<ENTITIES extends EntityV2[] = EntityV2[]> = {
  consistent?: boolean
  attributes?: EntityPathsIntersection<ENTITIES>[]
}

type RequestEntities<
  REQUESTS extends BatchGetItemRequestProps[],
  RESULTS extends EntityV2[] = []
> = REQUESTS extends [infer REQUESTS_HEAD, ...infer REQUESTS_TAIL]
  ? REQUESTS_HEAD extends BatchGetItemRequestProps
    ? REQUESTS_TAIL extends BatchGetItemRequestProps[]
      ? REQUESTS_HEAD[$entity]['name'] extends RESULTS[number]['name']
        ? RequestEntities<REQUESTS_TAIL, RESULTS>
        : RequestEntities<REQUESTS_TAIL, [...RESULTS, REQUESTS_HEAD[$entity]]>
      : never
    : never
  : RESULTS

export class BatchGetTableItemsRequest<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[],
  REQUESTS extends BatchGetItemRequestProps[] = BatchGetItemRequestProps[]
> extends TableAction<TABLE> {
  static actionName = 'getTableItemBatch' as const;

  [$requests]?: REQUESTS;
  [$options]?: BatchGetTableItemsOptions<ENTITIES>

  constructor(
    table: TABLE,
    entities = ([] as unknown) as ENTITIES,
    requests?: REQUESTS,
    options?: BatchGetTableItemsOptions<ENTITIES>
  ) {
    super(table, entities)
    this[$requests] = requests
    this[$options] = options
  }

  requests<REQUESTS extends BatchGetItemRequestProps[]>(
    ...requests: REQUESTS
  ): BatchGetTableItemsRequest<TABLE, RequestEntities<REQUESTS>, REQUESTS> {
    const entities: EntityV2[] = []
    const entityNames = new Set<string>()

    for (const request of requests) {
      if (entityNames.has(request[$entity].name)) {
        continue
      }
      entities.push(request[$entity])
      entityNames.add(request[$entity].name)
    }

    return new BatchGetTableItemsRequest(
      this[$table],
      entities as RequestEntities<REQUESTS>,
      requests
    )
  }

  options(
    nextOptions: BatchGetTableItemsOptions<ENTITIES>
  ): BatchGetTableItemsRequest<TABLE, ENTITIES, REQUESTS> {
    return new BatchGetTableItemsRequest(
      this[$table],
      this[$entities],
      this[$requests],
      nextOptions
    )
  }

  params(): NonNullable<NonNullable<BatchGetCommandInput>['RequestItems']>[string] {
    if (this[$requests] === undefined || this[$requests].length === 0) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchGetTableItemsRequest incomplete: No batchGetItemRequest supplied'
      })
    }
    const firstGetItemRequest = this[$requests][0]
    const firstGetItemRequestEntity = firstGetItemRequest[$entity]

    const { consistent, attributes: _attributes } = this[$options] ?? {}
    const attributes = _attributes as string[] | undefined
    let projectionExpression: string | undefined = undefined
    const expressionAttributeNames: Record<string, string> = {}

    // TODO: For now, we compute the projectionExpression using the first entity. Will probably use Table schemas once they exist.
    if (attributes !== undefined) {
      const { entityAttributeName } = firstGetItemRequestEntity

      const {
        ExpressionAttributeNames: projectionExpressionAttributeNames,
        ProjectionExpression
      } = firstGetItemRequestEntity
        .build(EntityPathParser)
        .parse(
          // entityAttributeName is required at all times for formatting
          attributes.includes(entityAttributeName)
            ? attributes
            : [entityAttributeName, ...attributes]
        )
        .toCommandOptions()

      Object.assign(expressionAttributeNames, projectionExpressionAttributeNames)
      projectionExpression = ProjectionExpression

      //  table partitionKey and sortKey are required at all times for response re-ordering
      const { partitionKey, sortKey } = this[$table]

      const filteredAttributes = new Set<string>(Object.values(expressionAttributeNames))
      if (!filteredAttributes.has(partitionKey.name)) {
        projectionExpression += `, #_pk`
        expressionAttributeNames['#_pk'] = partitionKey.name
      }

      if (sortKey !== undefined && !filteredAttributes.has(sortKey.name)) {
        projectionExpression += `, #_sk`
        expressionAttributeNames['#_sk'] = sortKey.name
      }
    }

    const keys: Record<string, any>[] = []

    for (const batchGetItemRequest of this[$requests]) {
      const { key } = batchGetItemRequest.params()
      keys.push(key)
    }

    return {
      Keys: keys,
      ...(consistent !== undefined ? { ConsistentRead: parseConsistentOption(consistent) } : {}),
      ...(projectionExpression !== undefined ? { ProjectionExpression: projectionExpression } : {}),
      ...(!isEmpty(expressionAttributeNames)
        ? { ExpressionAttributeNames: expressionAttributeNames }
        : {})
    }
  }
}
