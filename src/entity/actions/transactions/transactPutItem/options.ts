import type { Condition } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'

export interface PutItemTransactionOptions<ENTITY extends Entity = Entity> {
  condition?: Condition<ENTITY>
}
