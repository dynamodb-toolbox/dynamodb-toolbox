import type { ItemPreComputeKey } from 'v2/item'

import type { EntityV2 } from '../class'

export type KeyOutputs<E extends EntityV2> = ItemPreComputeKey<E['item']>
