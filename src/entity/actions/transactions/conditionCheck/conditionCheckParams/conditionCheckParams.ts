import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import type { Condition } from '~/entity/actions/parseCondition.js'
import type { EntityV2 } from '~/entity/index.js'

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
