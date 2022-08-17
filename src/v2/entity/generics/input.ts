import type { ItemInput } from 'v2/item'

import type { EntityV2 } from '../class'

/**
 * Entity input of a PUT command for a given Entity
 *
 * @param E Entity
 * @return Object
 */
export type Input<E extends EntityV2> = ItemInput<E['item']>
