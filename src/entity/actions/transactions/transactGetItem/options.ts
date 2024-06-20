import type { EntityPaths } from '~/entity/actions/parsePaths.js'
import type { EntityV2 } from '~/entity/index.js'

export type GetItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> = {
  attributes?: EntityPaths<ENTITY>[]
}
