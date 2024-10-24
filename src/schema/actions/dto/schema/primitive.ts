import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { nul } from '~/attributes/null/index.js'
import { number } from '~/attributes/number/index.js'
import { string } from '~/attributes/string/index.js'

import { attrStateDTOAttributes } from './state.js'

export const nullAttrDTOSchema = map({
  type: string().const('null'),
  ...attrStateDTOAttributes,
  enum: list(nul()).optional()
})

export const booleanAttrDTOSchema = map({
  type: string().const('boolean'),
  ...attrStateDTOAttributes,
  enum: list(boolean()).optional()
})

export const numberAttrDTOSchema = map({
  type: string().const('number'),
  ...attrStateDTOAttributes,
  big: boolean().optional(),
  enum: list(anyOf(number(), string())).optional()
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

export const stringAttrDTOSchema = map({
  type: string().const('string'),
  ...attrStateDTOAttributes,
  enum: list(string()).optional(),
  transform: strTransformersSchema
})

export const binaryAttrDTOSchema = map({
  type: string().const('binary'),
  ...attrStateDTOAttributes,
  enum: list(string()).optional()
})
