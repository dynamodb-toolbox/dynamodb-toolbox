import type { EntityPaths } from '~/entity/actions/parsePaths.js'
import type { Entity } from '~/entity/index.js'

export type GetItemTransactionOptions<ENTITY extends Entity = Entity> = {
  attributes?: EntityPaths<ENTITY>[]
}
