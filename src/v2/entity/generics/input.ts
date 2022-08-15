import type { ItemInput } from 'v2/item'

import type { EntityV2 } from '../class'

export type Input<E extends EntityV2> = ItemInput<E['item']>
