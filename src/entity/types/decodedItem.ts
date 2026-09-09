import type { Entity } from '~/entity/index.js'
import type { DecodedValue } from '~/schema/index.js'

import type { ReadItemOptions } from './options.js'

/** Item of an entity as decoded from DynamoDB, prior to formatting. */
export type DecodedItem<
  ENTITY extends Entity = Entity,
  OPTIONS extends ReadItemOptions<ENTITY> = {}
> = DecodedValue<ENTITY['schema'], OPTIONS>
