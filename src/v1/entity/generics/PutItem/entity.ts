import type { EntityV2 } from 'v1'
import type { ResolvedMapAttribute } from 'v1/schema'

import type { SchemaPutItem } from './schema'

export type PutItem<ENTITY extends EntityV2> = EntityV2 extends ENTITY
  ? ResolvedMapAttribute
  : SchemaPutItem<ENTITY['schema']>
