import type { EntityV2 } from 'v1/entity'
import type { Condition } from 'v1/entity/actions/parseCondition'

export interface DeleteItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> {
  condition?: Condition<ENTITY>
}
