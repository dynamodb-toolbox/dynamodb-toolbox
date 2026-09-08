import type { Entity } from '~/entity/index.js'
import type { InputValue } from '~/schema/index.js'

import type { WriteItemOptions } from './options.js'

/** Item accepted as input when writing an entity (before defaults and links). */
export type InputItem<ENTITY extends Entity, OPTIONS extends WriteItemOptions = {}> = InputValue<
  ENTITY['schema'],
  OPTIONS
>

/** Item accepted as input when only an entity's key attributes are required. */
export type KeyInputItem<ENTITY extends Entity> = InputItem<ENTITY, { mode: 'key' }>
