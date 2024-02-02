import { parseConditionCheck } from './parseConditionCheckOptions'
import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import type { EntityV2 } from 'v1/entity'
import { Condition, KeyInput } from 'v1/operations/types'
import { parseEntityKeyInput } from 'v1/operations/utils/parseKeyInput'
import { parsePrimaryKey } from 'v1/operations/utils/parsePrimaryKey'

export type ConditionCheckParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['ConditionCheck']
>

export const conditionCheckParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  condition: Condition<ENTITY>
): ConditionCheckParams => {
  const validKeyInputParser = parseEntityKeyInput(entity, input)
  const validKeyInput = validKeyInputParser.next().value
  const collapsedInput = validKeyInputParser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : collapsedInput
  const primaryKey = parsePrimaryKey(entity, keyInput)

  const parsedCondition = parseConditionCheck(entity, condition)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...parsedCondition
  }
}
