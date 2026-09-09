import type { Condition } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import type { CapacityOption } from '~/options/capacity.js'
import type { MetricsOption } from '~/options/metrics.js'
import type { AllOldReturnValuesOption, NoneReturnValuesOption } from '~/options/returnValues.js'
import type { ReturnValuesOnConditionFalseOption } from '~/options/returnValuesOnConditionFalse.js'

/** `returnValues` options accepted by a `PutItemCommand`. */
export type PutItemCommandReturnValuesOption = NoneReturnValuesOption | AllOldReturnValuesOption

export const putItemCommandReturnValuesOptions = [
  'NONE',
  'ALL_OLD'
] as const satisfies readonly PutItemCommandReturnValuesOption[]
export const putItemCommandReturnValuesOptionsSet = new Set<PutItemCommandReturnValuesOption>(
  putItemCommandReturnValuesOptions
)

/** Options accepted by a `PutItemCommand` (capacity, metrics, return values, condition, table name). */
export interface PutItemOptions<ENTITY extends Entity = Entity> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: PutItemCommandReturnValuesOption
  returnValuesOnConditionFalse?: ReturnValuesOnConditionFalseOption
  condition?: Condition<ENTITY>
  tableName?: string
}
