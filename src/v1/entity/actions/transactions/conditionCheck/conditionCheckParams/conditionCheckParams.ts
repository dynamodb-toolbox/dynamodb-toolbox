import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { EntityParser } from 'v1/entity/actions/parse'
import type { KeyInput } from 'v1/entity/actions/tParse'
import type { EntityCondition } from 'v1/entity/actions/parseCondition'

import { parseConditionCheck } from './parseConditionCheckOptions'

export type ConditionCheckParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['ConditionCheck']
>

export const conditionCheckParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  condition: EntityCondition<ENTITY>
): ConditionCheckParams => {
  const { key } = entity.build(EntityParser).parse(input, { operation: 'key' })
  const parsedCondition = parseConditionCheck(entity, condition)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...parsedCondition
  }
}
