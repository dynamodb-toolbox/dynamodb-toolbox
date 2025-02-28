import type { AttrSchema } from '~/attributes/index.js'
import type { Paths } from '~/schema/index.js'

export interface FormatValueOptions<SCHEMA extends AttrSchema> {
  format?: boolean
  transform?: boolean
  attributes?: Paths<SCHEMA>[]
  partial?: boolean
}

export interface FormatAttrValueOptions<SCHEMA extends AttrSchema>
  extends FormatValueOptions<SCHEMA> {
  valuePath?: (string | number)[]
}

export interface InferReadValueOptions<
  SCHEMA extends AttrSchema,
  OPTIONS extends FormatValueOptions<SCHEMA>
> {
  attributes: OPTIONS extends { attributes: string[] } ? OPTIONS['attributes'][number] : undefined
  partial: OPTIONS extends { partial: boolean } ? OPTIONS['partial'] : undefined
}
