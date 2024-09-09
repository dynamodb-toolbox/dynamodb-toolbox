import type { Condition } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import type { CapacityOption } from '~/options/capacity.js'
import type { MetricsOption } from '~/options/metrics.js'
import type { AllOldReturnValuesOption, NoneReturnValuesOption } from '~/options/returnValues.js'

export type PutItemCommandReturnValuesOption = NoneReturnValuesOption | AllOldReturnValuesOption

export const putItemCommandReturnValuesOptionsSet = new Set<PutItemCommandReturnValuesOption>([
  'NONE',
  'ALL_OLD'
])

export interface PutItemOptions<ENTITY extends Entity = Entity> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: PutItemCommandReturnValuesOption
  condition?: Condition<ENTITY>
  tableName?: string
}
