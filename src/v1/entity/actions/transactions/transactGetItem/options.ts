import type { EntityV2 } from 'v1/entity'
import type { EntityPaths } from 'v1/entity/actions/parsePaths'

export type GetItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> = {
  attributes?: EntityPaths<ENTITY>[]
}
