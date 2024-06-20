import type { CapacityOption } from 'v1/options/capacity.js'
import type { MetricsOption } from 'v1/options/metrics.js'
import type { NoneReturnValuesOption, AllOldReturnValuesOption } from 'v1/options/returnValues.js'
import type { EntityV2 } from 'v1/entity/index.js'
import type { Condition } from 'v1/entity/actions/parseCondition.js'

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
