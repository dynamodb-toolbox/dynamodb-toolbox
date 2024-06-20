import type { EntityV2 } from '~/entity/index.js'
import type { Condition } from '~/entity/actions/parseCondition.js'

export interface DeleteItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> {
  condition?: Condition<ENTITY>
}
