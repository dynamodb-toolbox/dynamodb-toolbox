import type { Entity } from '~/entity/index.js'
import type { Paths } from '~/schema/index.js'

/** Options accepted by an `EntityFormatter` (transform, projected attributes, partial). */
export interface FormatItemOptions<ENTITY extends Entity = Entity> {
  transform?: boolean
  attributes?: Paths<ENTITY['schema']>[]
  partial?: boolean
}

/** Read item options inferred from some `FormatItemOptions`. */
export interface InferReadItemOptions<
  ENTITY extends Entity,
  OPTIONS extends FormatItemOptions<ENTITY>
> {
  attributes: OPTIONS extends { attributes: string[] } ? OPTIONS['attributes'][number] : undefined
  partial: OPTIONS extends { partial: boolean } ? OPTIONS['partial'] : undefined
}
