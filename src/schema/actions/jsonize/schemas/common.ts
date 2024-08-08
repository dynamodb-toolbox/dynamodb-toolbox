import { any } from '~/attributes/any/index.js'
import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { requiredOptionsArray } from '~/attributes/constants/requiredOptions.js'
import { map } from '~/attributes/map/index.js'
import { record } from '~/attributes/record/index.js'
import { string } from '~/attributes/string/index.js'

export const requiredSchema = string()
  .enum(...requiredOptionsArray)
  .optional()
export const hiddenSchema = boolean().optional()
export const keySchema = boolean().optional()
export const savedAsSchema = string().optional()

export const defaultsSchema = record(
  string().enum('put', 'key', 'update'),
  anyOf(
    map({ defaulterType: string().const('value'), value: any() }),
    map({ defaulterType: string().const('custom') })
  )
).optional()

export const linksSchema = record(
  string().enum('put', 'key', 'update'),
  map({ linkerType: string().const('custom') })
).optional()

export const jsonAttrOptionSchemas = {
  required: requiredSchema,
  hidden: hiddenSchema,
  key: keySchema,
  savedAs: savedAsSchema,
  defaults: defaultsSchema,
  links: linksSchema
}
