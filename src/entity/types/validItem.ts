import type { Entity } from '~/entity/index.js'
import type { ValidValue } from '~/schema/index.js'

import type { WriteItemOptions } from './options.js'

export type ValidItem<ENTITY extends Entity, OPTIONS extends WriteItemOptions = {}> = ValidValue<
  ENTITY['schema'],
  OPTIONS
>
