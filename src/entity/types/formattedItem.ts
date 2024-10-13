import type { Entity } from '~/entity/index.js'
import type { FormattedValue } from '~/schema/index.js'

import type { ReadItemOptions } from './options.js'

export type FormattedItem<
  ENTITY extends Entity = Entity,
  OPTIONS extends ReadItemOptions<ENTITY> = {}
> = FormattedValue<ENTITY['schema'], OPTIONS>
