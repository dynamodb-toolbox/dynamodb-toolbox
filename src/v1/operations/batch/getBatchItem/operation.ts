import type { BatchGetCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import type { TableV2 } from 'v1/table'

import { $entities, $table, TableOperation } from 'v1/operations/class'
import type { BatchGetItemOptions } from './options'
import { AnyAttributePath, KeyInput } from 'v1/operations/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { parseEntityKeyInput } from 'v1/operations/utils/parseKeyInput'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'
import { parseProjection } from 'v1/operations/expression/projection'

const $options = Symbol('$options')
const $keys = Symbol('$keys')

type KeysInput<ENTITIES extends EntityV2[]> = EntityV2[] extends ENTITIES
  ? Record<string, KeyInput<EntityV2>[]>
  : {
      [ENTITY in ENTITIES[number] as ENTITY['name']]?: KeyInput<ENTITY>[]
    }

export class GetBatchItemsCommand<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[],
  OPTIONS extends BatchGetItemOptions<ENTITIES> = BatchGetItemOptions<ENTITIES>
> extends TableOperation<TABLE, ENTITIES> {
  static operationName = 'batchGet' as const

  entities: <NEXT_ENTITIES extends EntityV2[]>(
    ...nextEntities: NEXT_ENTITIES
  ) => GetBatchItemsCommand<
    TABLE,
    NEXT_ENTITIES,
    OPTIONS extends BatchGetItemOptions<NEXT_ENTITIES>
      ? OPTIONS
      : BatchGetItemOptions<NEXT_ENTITIES>
  >;
  [$options]: OPTIONS
  options: <NEXT_OPTIONS extends BatchGetItemOptions<ENTITIES>>(
    nextOptions: NEXT_OPTIONS
  ) => GetBatchItemsCommand<TABLE, ENTITIES, NEXT_OPTIONS>;
  [$keys]?: KeysInput<ENTITIES>
  keys: (keys: KeysInput<ENTITIES>) => GetBatchItemsCommand<TABLE, ENTITIES, OPTIONS>

  constructor(
    table: TABLE,
    entities = ([] as unknown) as ENTITIES,
    keys?: KeysInput<ENTITIES>,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(table, entities)
    this[$options] = options
    this[$keys] = keys

    this.entities = <NEXT_ENTITIES extends EntityV2[]>(...nextEntities: NEXT_ENTITIES) =>
      new GetBatchItemsCommand(
        this[$table],
        nextEntities,
        this[$keys] as KeysInput<NEXT_ENTITIES> | undefined,
        this[$options] as OPTIONS extends BatchGetItemOptions<NEXT_ENTITIES>
          ? OPTIONS
          : BatchGetItemOptions<NEXT_ENTITIES>
      )
    this.options = nextOptions =>
      new GetBatchItemsCommand(this[$table], this[$entities], this[$keys], nextOptions)
    this.keys = nextKeys =>
      new GetBatchItemsCommand(this[$table], this[$entities], nextKeys, this[$options])
  }

  params = (): NonNullable<BatchGetCommandInput['RequestItems']>[string] => {
    if (!this[$keys]) {
      throw new DynamoDBToolboxError('operations.incompleteCommand', {
        message: 'GetBatchItemsCommand incomplete: Missing "keys" property'
      })
    }

    for (const entity of this[$entities]) {
      const entityName = entity.name
      for (const input of (this[$keys] as Record<string, KeyInput<EntityV2>[]>)[entityName]) {
        const validKeyInputParser = parseEntityKeyInput(entity, input)
        const validKeyInput = validKeyInputParser.next().value
        const collapsedInput = validKeyInputParser.next().value

        const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : collapsedInput
        const primaryKey = parsePrimaryKey(entity, keyInput)

        const attributes = ((this[$options]['attributes'] ?? {}) as Record<
          string,
          AnyAttributePath
        >)[entityName]

        if (attributes !== undefined) {
          const { ExpressionAttributeNames, ProjectionExpression } = parseProjection(
            entity,
            attributes
          )

          if (!isEmpty(ExpressionAttributeNames)) {
            commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
          }

          commandOptions.ProjectionExpression = ProjectionExpression
        }

        rejectExtraOptions(extraOptions)
      }
    }

    return {}
  }
}
