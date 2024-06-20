import type { EntityV2 } from '~/entity/index.js'
import type { EntityPaths } from '~/entity/actions/parsePaths.js'
import type { CapacityOption } from '~/options/capacity.js'

export interface GetItemOptions<ENTITY extends EntityV2 = EntityV2> {
  capacity?: CapacityOption
  consistent?: boolean
  attributes?: EntityPaths<ENTITY>[]
}
