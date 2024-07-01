import type { Condition } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'

export interface UpdateItemTransactionOptions<ENTITY extends Entity = Entity> {
  condition?: Condition<ENTITY>
}
