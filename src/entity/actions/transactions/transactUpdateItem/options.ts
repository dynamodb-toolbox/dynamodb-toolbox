import type { Condition } from '~/entity/actions/parseCondition.js'
import type { EntityV2 } from '~/entity/index.js'

export interface UpdateItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> {
  condition?: Condition<ENTITY>
}
