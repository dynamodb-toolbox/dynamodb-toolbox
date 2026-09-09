import type { Entity } from '~/entity/index.js'
import type { FormattedValue } from '~/schema/index.js'

import type { ReadItemOptions } from './options.js'

/** App-facing item of an entity after reads are projected and formatted. */
export type FormattedItem<
  ENTITY extends Entity = Entity,
  OPTIONS extends ReadItemOptions<ENTITY> = {}
> = FormattedValue<ENTITY['schema'], OPTIONS>
