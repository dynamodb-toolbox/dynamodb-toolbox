import type { Condition } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import type { CapacityOption } from '~/options/capacity.js'
import type { MetricsOption } from '~/options/metrics.js'
import type { AllOldReturnValuesOption, NoneReturnValuesOption } from '~/options/returnValues.js'
import type { ReturnValuesOnConditionFalseOption } from '~/options/returnValuesOnConditionFalse.js'

export type DeleteItemCommandReturnValuesOption = NoneReturnValuesOption | AllOldReturnValuesOption

export const deleteItemCommandReturnValuesOptions = [
  'NONE',
  'ALL_OLD'
] as const satisfies readonly DeleteItemCommandReturnValuesOption[]
export const deleteItemCommandReturnValuesOptionsSet = new Set<DeleteItemCommandReturnValuesOption>(
  deleteItemCommandReturnValuesOptions
)

export interface DeleteItemOptions<ENTITY extends Entity = Entity> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: DeleteItemCommandReturnValuesOption
  returnValuesOnConditionFalse?: ReturnValuesOnConditionFalseOption
  condition?: Condition<ENTITY>
  tableName?: string
}
