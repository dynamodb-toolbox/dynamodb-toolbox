import type { ItemKeyInput } from 'v2/item'

import type { EntityV2 } from '../class'

export type KeyInputs<E extends EntityV2> = ItemKeyInput<E['item']>
