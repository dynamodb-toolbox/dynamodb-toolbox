import { any } from '~/attributes/any/index.js'
import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { requiredOptionsArray } from '~/attributes/constants/requiredOptions.js'
import { map } from '~/attributes/map/index.js'
import { record } from '~/attributes/record/index.js'
import { string } from '~/attributes/string/index.js'

export const requiredDTOSchema = string()
  .enum(...requiredOptionsArray)
  .optional()
export const hiddenDTOSchema = boolean().optional()
export const keyDTOSchema = boolean().optional()
export const savedAsDTOSchema = string().optional()

export const defaultsDTOSchema = record(
  string().enum('put', 'key', 'update'),
  anyOf(
    map({ defaulterId: string().const('value'), value: any() }),
    map({ defaulterId: string().const('custom') })
  )
).optional()

export const linksDTOSchema = record(
  string().enum('put', 'key', 'update'),
  map({ linkerId: string().const('custom') })
).optional()

export const attrStateDTOAttributes = {
  required: requiredDTOSchema,
  hidden: hiddenDTOSchema,
  key: keyDTOSchema,
  savedAs: savedAsDTOSchema,
  defaults: defaultsDTOSchema,
  links: linksDTOSchema
}
