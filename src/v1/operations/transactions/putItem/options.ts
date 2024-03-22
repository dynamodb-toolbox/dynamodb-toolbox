import type { EntityV2 } from 'v1/entity/class'
import type { ConditionOptions } from 'v1/operations/types/condition'

export type PutItemTransactionOptions<ENTITY extends EntityV2 = EntityV2> = ConditionOptions<ENTITY>
