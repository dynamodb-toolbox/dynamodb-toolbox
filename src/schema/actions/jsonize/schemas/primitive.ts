import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { nul } from '~/attributes/nul/index.js'
import { number } from '~/attributes/number/index.js'
import { string } from '~/attributes/string/index.js'

import { jsonAttrOptionSchemas } from './common.js'

export const jsonNullAttrSchema = map({
  type: string().const('null'),
  ...jsonAttrOptionSchemas,
  enum: list(nul()).optional()
})

export const jsonBooleanAttrSchema = map({
  type: string().const('boolean'),
  ...jsonAttrOptionSchemas,
  enum: list(boolean()).optional()
})

export const jsonNumberAttrSchema = map({
  type: string().const('number'),
  ...jsonAttrOptionSchemas,
  enum: list(number()).optional()
})

const strTransformersSchema = anyOf(
  map({
    transformerId: string().const('prefix'),
    prefix: string(),
    delimiter: string().optional()
  }),
  map({
    transformerId: string().const('custom')
  })
).optional()

export const jsonStringAttrSchema = map({
  type: string().const('string'),
  ...jsonAttrOptionSchemas,
  enum: list(string()).optional(),
  transform: strTransformersSchema
})

export const jsonBinaryAttrSchema = map({
  type: string().const('binary'),
  ...jsonAttrOptionSchemas,
  enum: list(string()).optional()
})
