import type { EntityV2 } from '~/entity/index.js'
import type { EntityPaths } from '~/entity/actions/parsePaths.js'

export type GetItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> = {
  attributes?: EntityPaths<ENTITY>[]
}
