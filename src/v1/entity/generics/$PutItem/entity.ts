import type { EntityV2 } from 'v1'

import type { $ItemPutItem } from './item'

// TODO: Required in Entity constructor... See if possible to use only PutItem
export type $PutItem<ENTITY extends EntityV2> = $ItemPutItem<ENTITY['$item']>
