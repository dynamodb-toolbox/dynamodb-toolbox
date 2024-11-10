import type { Entity } from '~/entity/index.js'
import type { Paths } from '~/schema/index.js'

export interface FormatItemOptions<ENTITY extends Entity = Entity> {
  transform?: boolean
  attributes?: Paths<ENTITY['schema']>[]
  partial?: boolean
}

export interface InferReadItemOptions<
  ENTITY extends Entity,
  OPTIONS extends FormatItemOptions<ENTITY>
> {
  attributes: OPTIONS extends { attributes: string[] } ? OPTIONS['attributes'][number] : undefined
  partial: OPTIONS extends { partial: boolean } ? OPTIONS['partial'] : undefined
}
