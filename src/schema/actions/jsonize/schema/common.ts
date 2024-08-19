import { any } from '~/attributes/any/index.js'
import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { requiredOptionsArray } from '~/attributes/constants/requiredOptions.js'
import { map } from '~/attributes/map/index.js'
import { record } from '~/attributes/record/index.js'
import { string } from '~/attributes/string/index.js'

export const jsonizedRequiredSchema = string()
  .enum(...requiredOptionsArray)
  .optional()
export const jsonizedHiddenSchema = boolean().optional()
export const jsonizedKeySchema = boolean().optional()
export const jsonizedSavedAsSchema = string().optional()

export const jsonizedDefaultsSchema = record(
  string().enum('put', 'key', 'update'),
  anyOf(
    map({ defaulterId: string().const('value'), value: any() }),
    map({ defaulterId: string().const('custom') })
  )
).optional()

export const jsonizedLinksSchema = record(
  string().enum('put', 'key', 'update'),
  map({ linkerId: string().const('custom') })
).optional()

export const jsonizedAttrOptionSchemas = {
  required: jsonizedRequiredSchema,
  hidden: jsonizedHiddenSchema,
  key: jsonizedKeySchema,
  savedAs: jsonizedSavedAsSchema,
  defaults: jsonizedDefaultsSchema,
  links: jsonizedLinksSchema
}
