import type { Condition } from '~/entity/actions/parseCondition.js'
import type { EntityV2 } from '~/entity/index.js'

export interface PutItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> {
  condition?: Condition<ENTITY>
}
