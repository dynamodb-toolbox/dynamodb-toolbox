import type { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityParser } from '~/entity/actions/parse.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import type { Condition } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'

import { parseConditionCheckOptions } from './parseConditionCheckOptions.js'

export type ConditionCheckParams = NonNullable<
  NonNullable<TransactWriteCommandInput['TransactItems']>[number]['ConditionCheck']
>

type ConditionCheckParamsGetter = <ENTITY extends Entity>(
  entity: ENTITY,
  input: KeyInput<ENTITY>,
  condition: Condition<ENTITY>
) => ConditionCheckParams

export const conditionCheckParams: ConditionCheckParamsGetter = (entity, input, condition) => {
  const { key } = entity.build(EntityParser).parse(input, { mode: 'key' })
  const options = parseConditionCheckOptions(entity, condition)

  return {
    TableName: entity.table.getName(),
    Key: key,
    ...options
  }
}
