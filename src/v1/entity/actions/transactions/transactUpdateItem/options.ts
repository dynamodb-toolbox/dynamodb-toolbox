import type { EntityV2 } from 'v1/entity'
import type { Condition } from 'v1/entity/actions/parseCondition'

export interface UpdateItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> {
  condition?: Condition<ENTITY>
}
