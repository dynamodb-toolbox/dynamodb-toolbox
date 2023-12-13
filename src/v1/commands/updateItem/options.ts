import type { CapacityOption } from 'v1/commands/constants/options/capacity'
import type { MetricsOption } from 'v1/commands/constants/options/metrics'
import type { ReturnValuesOption } from 'v1/commands/constants/options/returnValues'
import type { Condition } from 'v1/commands/types/condition'
import type { EntityV2 } from 'v1/entity'

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