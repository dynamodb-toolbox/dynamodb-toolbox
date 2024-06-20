import type { CapacityOption } from 'v1/options/capacity.js'
import type { MetricsOption } from 'v1/options/metrics.js'
import type { ReturnValuesOption } from 'v1/options/returnValues.js'
import type { EntityV2 } from 'v1/entity/index.js'
import type { Condition } from 'v1/entity/actions/parseCondition.js'

export type UpdateItemCommandReturnValuesOption = ReturnValuesOption

export const updateItemCommandReturnValuesOptionsSet = new Set<UpdateItemCommandReturnValuesOption>(
  ['NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', 'UPDATED_NEW']
)

export interface UpdateItemOptions<ENTITY extends EntityV2 = EntityV2> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: UpdateItemCommandReturnValuesOption
  condition?: Condition<ENTITY>
}
