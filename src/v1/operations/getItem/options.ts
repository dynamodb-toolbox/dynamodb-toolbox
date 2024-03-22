import type { EntityV2 } from 'v1/entity/class'
import type { CapacityOption } from 'v1/operations/constants/options/capacity'
import type { EntityPaths } from 'v1/operations/paths'

export interface GetItemOptions<ENTITY extends EntityV2 = EntityV2> {
  capacity?: CapacityOption
  consistent?: boolean
  attributes?: EntityPaths<ENTITY>[]
}
