import type { Entity } from '~/entity/index.js'
import type { InputValue } from '~/schema/index.js'

import type { WriteItemOptions } from './options.js'

export type InputItem<ENTITY extends Entity, OPTIONS extends WriteItemOptions = {}> = InputValue<
  ENTITY['schema'],
  OPTIONS
>

export type KeyInputItem<ENTITY extends Entity> = InputItem<ENTITY, { mode: 'key' }>
