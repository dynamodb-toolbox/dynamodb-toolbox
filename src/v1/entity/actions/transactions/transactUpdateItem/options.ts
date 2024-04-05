import type { EntityV2 } from 'v1/entity'
import type { EntityCondition } from 'v1/entity/actions/parseCondition'

export interface UpdateItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> {
  condition?: EntityCondition<ENTITY>
}
