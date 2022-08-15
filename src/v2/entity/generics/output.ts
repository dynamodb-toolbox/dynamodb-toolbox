import type { ItemOutput } from 'v2/item'

import { EntityV2 } from '../class'

export type Output<E extends EntityV2> = ItemOutput<E['item']>
