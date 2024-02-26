import { parseConditionCheck } from './parseConditionCheckOptions'
import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import type { EntityV2 } from 'v1/entity'
import { Condition, KeyInput } from 'v1/operations/types'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'
import { Parser } from 'v1/schema'

export type ConditionCheckParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['ConditionCheck']
>

export const conditionCheckParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  condition: Condition<ENTITY>
): ConditionCheckParams => {
  const workflow = entity.schema.build(Parser).workflow(input, {
    fill: 'key',
    transform: true,
    filters: { key: true },
    requiringOptions: new Set(['always'])
  })

  workflow.next() // defaulted
  workflow.next() // linked
  const validKeyInput = workflow.next().value
  const transformedInput = workflow.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : transformedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const parsedCondition = parseConditionCheck(entity, condition)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...parsedCondition
  }
}
