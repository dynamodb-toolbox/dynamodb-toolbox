import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity/index.js'
import { EntityParser } from 'v1/entity/actions/parse.js'
import type { KeyInput } from 'v1/entity/actions/parse.js'
import type { Condition } from 'v1/entity/actions/parseCondition.js'

import { parseConditionCheck } from './parseConditionCheckOptions.js'

export type ConditionCheckParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['ConditionCheck']
>

export const conditionCheckParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  condition: Condition<ENTITY>
): ConditionCheckParams => {
  const { key } = entity.build(EntityParser).parse(input, { mode: 'key' })
  const parsedCondition = parseConditionCheck(entity, condition)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...parsedCondition
  }
}
