import type { ItemSavedAs } from 'v2/item'
import type { PrimaryKey } from 'v2/table'

import type { EntityV2 } from '../class'

/**
 * Shape of saved item in DynamoDB for a given Entity
 *
 * @param E Entity
 * @return Object
 */
export type SavedAs<E extends EntityV2> = ItemSavedAs<E['item']> & PrimaryKey<E['table']>
