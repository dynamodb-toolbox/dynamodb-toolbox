import type { Entity } from '~/entity/index.js'
import type { ValidValue } from '~/schema/index.js'

import type { WriteItemOptions } from './options.js'

/** Item of an entity after validation, defaults and links are applied. */
export type ValidItem<ENTITY extends Entity, OPTIONS extends WriteItemOptions = {}> = ValidValue<
  ENTITY['schema'],
  OPTIONS
>
