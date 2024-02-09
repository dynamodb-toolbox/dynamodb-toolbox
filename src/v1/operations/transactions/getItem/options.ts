import type { EntityV2 } from 'v1/entity'
import type { AnyAttributePath } from 'v1/operations/types'

export type GetItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> = {
  attributes?: AnyAttributePath<ENTITY>[]
}
