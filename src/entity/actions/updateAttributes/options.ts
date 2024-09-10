import type { Condition } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import type { CapacityOption } from '~/options/capacity.js'
import type { MetricsOption } from '~/options/metrics.js'
import type { ReturnValuesOption } from '~/options/returnValues.js'

export type UpdateAttributesCommandReturnValuesOption = ReturnValuesOption

export const updateAttributesCommandReturnValuesOptionsSet =
  new Set<UpdateAttributesCommandReturnValuesOption>([
    'NONE',
    'ALL_OLD',
    'UPDATED_OLD',
    'ALL_NEW',
    'UPDATED_NEW'
  ])

export interface UpdateAttributesOptions<ENTITY extends Entity = Entity> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: UpdateAttributesCommandReturnValuesOption
  condition?: Condition<ENTITY>
  tableName?: string
}
