import type { EntityV2 } from 'v1/entity/index.js'
import type { EntityPaths } from 'v1/entity/actions/parsePaths.js'
import type { CapacityOption } from 'v1/options/capacity.js'

export interface GetItemOptions<ENTITY extends EntityV2 = EntityV2> {
  capacity?: CapacityOption
  consistent?: boolean
  attributes?: EntityPaths<ENTITY>[]
}
