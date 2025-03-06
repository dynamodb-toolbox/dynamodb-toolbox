import type { Entity } from '~/entity/index.js'
import type { DecodedValue } from '~/schema/index.js'

import type { ReadItemOptions } from './options.js'

export type DecodedItem<
  ENTITY extends Entity = Entity,
  OPTIONS extends ReadItemOptions<ENTITY> = {}
> = DecodedValue<ENTITY['schema'], OPTIONS>
