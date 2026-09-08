import type { Entity } from '~/entity/index.js'
import type { TransformedValue } from '~/schema/index.js'

import type { WriteItemOptions } from './options.js'

/** Item of an entity after transformers and `savedAs` renaming are applied. */
export type TransformedItem<
  ENTITY extends Entity,
  OPTIONS extends WriteItemOptions = {}
> = TransformedValue<ENTITY['schema'], OPTIONS>
