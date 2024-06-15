import type { EntityV2 } from 'v1/entity'
import type { Condition } from 'v1/entity/actions/parseCondition'
import type { CapacityOption } from 'v1/options/capacity'
import type { MetricsOption } from 'v1/options/metrics'
import type { NoneReturnValuesOption, AllOldReturnValuesOption } from 'v1/options/returnValues'

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
