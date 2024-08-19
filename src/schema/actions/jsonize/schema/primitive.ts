import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { nul } from '~/attributes/nul/index.js'
import { number } from '~/attributes/number/index.js'
import { string } from '~/attributes/string/index.js'

import { jsonizedAttrOptionSchemas } from './common.js'

export const jsonizedNullAttrSchema = map({
  type: string().const('null'),
  ...jsonizedAttrOptionSchemas,
  enum: list(nul()).optional()
})

export const jsonizedBooleanAttrSchema = map({
  type: string().const('boolean'),
  ...jsonizedAttrOptionSchemas,
  enum: list(boolean()).optional()
})

export const jsonizedNumberAttrSchema = map({
  type: string().const('number'),
  ...jsonizedAttrOptionSchemas,
  enum: list(number()).optional()
})

const strTransformersSchema = anyOf(
  map({
    transformerId: string().const('prefix'),
    prefix: string(),
    delimiter: string()
  }),
  map({
    transformerId: string().const('custom')
  })
).optional()

export const jsonizedStringAttrSchema = map({
  type: string().const('string'),
  ...jsonizedAttrOptionSchemas,
  enum: list(string()).optional(),
  transform: strTransformersSchema
})

export const jsonizedBinaryAttrSchema = map({
  type: string().const('binary'),
  ...jsonizedAttrOptionSchemas,
  enum: list(string()).optional()
})
