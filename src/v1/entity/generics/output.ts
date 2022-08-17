import type { ItemOutput } from 'v1/item'

import { EntityV2 } from '../class'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity
 *
 * @param E Entity
 * @return Object
 */
export type Output<E extends EntityV2> = ItemOutput<E['item']>
