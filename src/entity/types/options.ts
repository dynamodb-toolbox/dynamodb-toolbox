import type { Entity } from '~/entity/index.js'
import type { ReadValueOptions, WriteValueOptions } from '~/schema/index.js'

export interface WriteItemOptions extends WriteValueOptions {}

export interface ReadItemOptions<ENTITY extends Entity = Entity>
  extends ReadValueOptions<ENTITY['schema']> {}
