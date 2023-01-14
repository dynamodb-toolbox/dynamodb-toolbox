import type { EntityV2 } from 'v1'

import type { _ItemPutItem } from './item'

// TODO: Required in Entity constructor... See if possible to use only PutItem
export type _PutItem<INPUT extends EntityV2> = _ItemPutItem<INPUT['_item']>
