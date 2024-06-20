import type { CapacityOption } from '~/options/capacity.js'
import type { MetricsOption } from '~/options/metrics.js'
import type { NoneReturnValuesOption, AllOldReturnValuesOption } from '~/options/returnValues.js'
import type { EntityV2 } from '~/entity/index.js'
import type { Condition } from '~/entity/actions/parseCondition.js'

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
