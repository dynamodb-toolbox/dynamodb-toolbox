import type { EntityV2 } from 'v1/entity/class'
import type { EntityPaths } from 'v1/operations/paths'

export type GetItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> = {
  attributes?: EntityPaths<ENTITY>[]
}
