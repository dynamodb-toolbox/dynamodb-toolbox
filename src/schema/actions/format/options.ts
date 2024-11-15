import type { Attribute } from '~/attributes/index.js'
import type { Paths, Schema } from '~/schema/index.js'

export interface FormatValueOptions<SCHEMA extends Schema | Attribute> {
  format?: boolean
  transform?: boolean
  attributes?: Paths<SCHEMA>[]
  partial?: boolean
}

export interface FormatAttrValueOptions<ATTRIBUTE extends Attribute>
  extends FormatValueOptions<ATTRIBUTE> {
  valuePath?: (string | number)[]
}

export interface InferReadValueOptions<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormatValueOptions<SCHEMA>
> {
  attributes: OPTIONS extends { attributes: string[] } ? OPTIONS['attributes'][number] : undefined
  partial: OPTIONS extends { partial: boolean } ? OPTIONS['partial'] : undefined
}
