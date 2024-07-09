import type { BatchGetCommandInput } from '@aws-sdk/lib-dynamodb'
import type { U } from 'ts-toolbelt'

import type { BatchGetRequest } from '~/entity/actions/batchGet.js'
import { EntityPathParser } from '~/entity/actions/parsePaths.js'
import type { EntityPathsIntersection } from '~/entity/actions/parsePaths.js'
import { $entity } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { parseConsistentOption } from '~/options/consistent.js'
import { $entities, $table, TableAction } from '~/table/index.js'
import type { Table } from '~/table/index.js'
import { isEmpty } from '~/utils/isEmpty.js'

export const $requests = Symbol('$requests')
export type $requests = typeof $requests

export const $options = Symbol('$options')
export type $options = typeof $options

export type BatchGetRequestProps = Pick<BatchGetRequest, $entity | 'params'>

export type BatchGetCommandOptions<ENTITIES extends Entity[] = Entity[]> = {
  consistent?: boolean
  // For some reason, this union is required to keep the strict type of `options.attributes`
  // when building a `BatchGetCommand` directly inside `execute`:
  // => execute(TestTable1.build(BatchGetCommand).requests(...).options({ attributes: ['attr'] }))
} & ({ attributes?: undefined } | { attributes: EntityPathsIntersection<ENTITIES>[] })

type RequestEntities<
  REQUESTS extends BatchGetRequestProps[],
  RESULTS extends Entity[] = []
> = number extends REQUESTS['length']
  ? U.ListOf<REQUESTS[number]> extends BatchGetRequestProps[]
    ? RequestEntities<U.ListOf<REQUESTS[number]>>
    : never
  : REQUESTS extends [infer REQUESTS_HEAD, ...infer REQUESTS_TAIL]
    ? REQUESTS_HEAD extends BatchGetRequestProps
      ? REQUESTS_TAIL extends BatchGetRequestProps[]
        ? REQUESTS_HEAD[$entity]['name'] extends RESULTS[number]['name']
          ? RequestEntities<REQUESTS_TAIL, RESULTS>
          : RequestEntities<REQUESTS_TAIL, [...RESULTS, REQUESTS_HEAD[$entity]]>
        : never
      : never
    : RESULTS

export class BatchGetCommand<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  REQUESTS extends BatchGetRequestProps[] = BatchGetRequestProps[],
  OPTIONS extends BatchGetCommandOptions<ENTITIES> = BatchGetCommandOptions<ENTITIES>
> extends TableAction<TABLE, ENTITIES> {
  static actionName = 'batchGet' as const;

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

  requests<NEXT_REQUESTS extends BatchGetRequestProps[]>(
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
      if (entityNames.has(request[$entity].name)) {
        continue
      }
      entities.push(request[$entity])
      entityNames.add(request[$entity].name)
    }

    return new BatchGetCommand(
      this[$table],
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
    return new BatchGetCommand(this[$table], this[$entities], this[$requests], nextOptions)
  }

  params(): NonNullable<BatchGetCommandInput['RequestItems']>[string] {
    if (this[$requests] === undefined || this[$requests].length === 0) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchGetCommand incomplete: No BatchGetRequest supplied'
      })
    }
    const firstRequest = this[$requests][0]
    const firstRequestEntity = firstRequest[$entity]

    const { consistent, attributes: _attributes } = this[$options] ?? {}
    const attributes = _attributes as string[] | undefined
    let projectionExpression: string | undefined = undefined
    const expressionAttributeNames: Record<string, string> = {}

    // TODO: For now, we compute the projectionExpression using the first entity. Will probably use Table schemas once they exist.
    if (attributes !== undefined) {
      const { entityAttributeName } = firstRequestEntity

      const { ExpressionAttributeNames: projectionExpressionAttributeNames, ProjectionExpression } =
        firstRequestEntity
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

    for (const request of this[$requests]) {
      const key = request.params()
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
