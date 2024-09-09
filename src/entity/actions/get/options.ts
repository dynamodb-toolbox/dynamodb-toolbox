import type { EntityPaths } from '~/entity/actions/parsePaths/index.js'
import type { Entity } from '~/entity/index.js'
import type { CapacityOption } from '~/options/capacity.js'

export interface GetItemOptions<ENTITY extends Entity = Entity> {
  capacity?: CapacityOption
  consistent?: boolean
  attributes?: EntityPaths<ENTITY>[]
  tableName?: string
}
