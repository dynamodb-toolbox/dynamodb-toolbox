import type { EntityPaths } from '~/entity/actions/parsePaths/index.js'
import type { Entity } from '~/entity/index.js'
import type { CapacityOption } from '~/options/capacity.js'

/** Options accepted by a `GetItemCommand` (capacity, consistent, projected attributes, table name). */
export interface GetItemOptions<ENTITY extends Entity = Entity> {
  capacity?: CapacityOption
  consistent?: boolean
  attributes?: EntityPaths<ENTITY>[]
  tableName?: string
}
