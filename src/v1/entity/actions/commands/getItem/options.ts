import type { EntityV2 } from 'v1/entity'
import type { EntityPaths } from 'v1/entity/actions/parsePaths'
import type { CapacityOption } from 'v1/operations/constants/options/capacity'

export interface GetItemOptions<ENTITY extends EntityV2 = EntityV2> {
  capacity?: CapacityOption
  consistent?: boolean
  attributes?: EntityPaths<ENTITY>[]
}
