import type { CapacityOption } from 'v1/options/capacity'
import type { MetricsOption } from 'v1/options/metrics'
import type { NoneReturnValuesOption, AllOldReturnValuesOption } from 'v1/options/returnValues'
import type { EntityV2 } from 'v1/entity'
import type { Condition } from 'v1/entity/actions/parseCondition'

export type DeleteItemCommandReturnValuesOption = NoneReturnValuesOption | AllOldReturnValuesOption

export const deleteItemCommandReturnValuesOptionsSet = new Set<DeleteItemCommandReturnValuesOption>(
  ['NONE', 'ALL_OLD']
)

export interface DeleteItemOptions<ENTITY extends EntityV2 = EntityV2> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: DeleteItemCommandReturnValuesOption
  condition?: Condition<ENTITY>
}
