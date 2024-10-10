import type { Entity } from '~/entity/index.js'
import type { FullValue } from '~/schema/index.js'

import type { WriteItemOptions } from './options.js'

export type FullItem<ENTITY extends Entity, OPTIONS extends WriteItemOptions = {}> = FullValue<
  ENTITY['schema'],
  OPTIONS
>
