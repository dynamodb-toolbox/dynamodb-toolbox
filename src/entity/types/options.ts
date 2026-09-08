import type { Entity } from '~/entity/index.js'
import type { ReadValueOptions, WriteValueOptions } from '~/schema/index.js'

/** Options controlling how an item is parsed for writes. */
export interface WriteItemOptions extends WriteValueOptions {}

/** Options controlling how an item is formatted on reads. */
export interface ReadItemOptions<ENTITY extends Entity = Entity>
  extends ReadValueOptions<ENTITY['schema']> {}
