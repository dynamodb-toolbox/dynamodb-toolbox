import type { EntityV2 } from 'v1/entity'
import type { EntityCondition } from 'v1/entity/actions/parseCondition'
import type { CapacityOption } from 'v1/options/capacity'
import type { MetricsOption } from 'v1/options/metrics'
import type { ReturnValuesOption } from 'v1/options/returnValues'

export type PutItemCommandReturnValuesOption = ReturnValuesOption

export const putItemCommandReturnValuesOptionsSet = new Set<PutItemCommandReturnValuesOption>([
  'NONE',
  'ALL_OLD',
  'UPDATED_OLD',
  'ALL_NEW',
  'UPDATED_NEW'
])

export interface PutItemOptions<ENTITY extends EntityV2 = EntityV2> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: PutItemCommandReturnValuesOption
  condition?: EntityCondition<ENTITY>
}
