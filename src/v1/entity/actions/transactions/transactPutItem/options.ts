import type { EntityV2 } from 'v1/entity/index.js'
import type { Condition } from 'v1/entity/actions/parseCondition.js'

export interface PutItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> {
  condition?: Condition<ENTITY>
}
