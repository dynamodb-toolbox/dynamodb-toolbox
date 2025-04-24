import type { ArrayPath } from '~/schema/actions/utils/types.js'
import type { Paths, Schema } from '~/schema/index.js'

export interface FormatValueOptions<SCHEMA extends Schema> {
  format?: boolean
  transform?: boolean
  attributes?: Paths<SCHEMA>[]
  partial?: boolean
}

export interface FormatAttrValueOptions<SCHEMA extends Schema> extends FormatValueOptions<SCHEMA> {
  valuePath?: ArrayPath
}

export interface InferReadValueOptions<
  SCHEMA extends Schema,
  OPTIONS extends FormatValueOptions<SCHEMA>
> {
  attributes: OPTIONS extends { attributes: string[] } ? OPTIONS['attributes'][number] : undefined
  partial: OPTIONS extends { partial: boolean } ? OPTIONS['partial'] : undefined
}
