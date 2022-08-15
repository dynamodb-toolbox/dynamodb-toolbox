import type { ItemSavedAs } from 'v2/item'
import type { PrimaryKey } from 'v2/table'

import type { EntityV2 } from '../class'

export type SavedAs<E extends EntityV2> = ItemSavedAs<E['item']> & PrimaryKey<E['table']>
