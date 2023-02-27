import type { EntityV2 } from 'v1'
import type { ResolvedMapAttribute } from 'v1/item'

import type { ItemPutItem } from './item'

export type PutItem<ENTITY extends EntityV2> = EntityV2 extends ENTITY
  ? ResolvedMapAttribute
  : ItemPutItem<ENTITY['item']>
