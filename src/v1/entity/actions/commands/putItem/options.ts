import type { EntityV2 } from 'v1/entity/index.js'
import type { Condition } from 'v1/entity/actions/parseCondition.js'
import type { CapacityOption } from 'v1/options/capacity.js'
import type { MetricsOption } from 'v1/options/metrics.js'
import type { NoneReturnValuesOption, AllOldReturnValuesOption } from 'v1/options/returnValues.js'

export type PutItemCommandReturnValuesOption = NoneReturnValuesOption | AllOldReturnValuesOption

export const putItemCommandReturnValuesOptionsSet = new Set<PutItemCommandReturnValuesOption>([
  'NONE',
  'ALL_OLD'
])

export interface PutItemOptions<ENTITY extends EntityV2 = EntityV2> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: PutItemCommandReturnValuesOption
  condition?: Condition<ENTITY>
}
