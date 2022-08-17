import type { ItemKeyInput } from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * Primary key input of a single item command (GET, DELETE ...) for a given Entity
 *
 * @param E Entity
 * @return Object
 */
export type KeyInput<E extends EntityV2> = ItemKeyInput<E['item']>
