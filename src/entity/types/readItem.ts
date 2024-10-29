import type { Entity } from '~/entity/index.js'
import type { ReadValue } from '~/schema/index.js'

import type { ReadItemOptions } from './options.js'

export type ReadItem<
  ENTITY extends Entity = Entity,
  OPTIONS extends ReadItemOptions<ENTITY> = {}
> = ReadValue<ENTITY['schema'], OPTIONS>
