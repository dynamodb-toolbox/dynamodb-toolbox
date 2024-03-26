import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { PrimaryKeyParser } from 'v1/table/actions/primaryKeyParser'
import type { EntityV2 } from 'v1/entity'
import { Parser } from 'v1/schema/actions/parse'
import type { Condition, KeyInput } from 'v1/operations/types'

import { parseConditionCheck } from './parseConditionCheckOptions'

export type ConditionCheckParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['ConditionCheck']
>

export const conditionCheckParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  condition: Condition<ENTITY>
): ConditionCheckParams => {
  const parser = entity.schema.build(Parser).start(input, { operation: 'key' })
  parser.next() // defaulted
  parser.next() // linked
  const validKeyInput = parser.next().value
  const transformedKeyInput = parser.next().value

  const keyInput = entity.computeKey ? entity.computeKey(validKeyInput) : transformedKeyInput
  const primaryKey = entity.table.build(PrimaryKeyParser).parse(keyInput)

  const parsedCondition = parseConditionCheck(entity, condition)

  return {
    TableName: entity.table.getName(),
    Key: primaryKey,
    ...parsedCondition
  }
}
