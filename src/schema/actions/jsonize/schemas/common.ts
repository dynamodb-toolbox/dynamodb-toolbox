import { boolean } from '~/attributes/boolean/index.js'
import { requiredOptionsArray } from '~/attributes/constants/requiredOptions.js'
import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'

export const requiredSchema = string()
  .enum(...requiredOptionsArray)
  .optional()
export const hiddenSchema = boolean().optional()
export const keySchema = boolean().optional()
export const savedAsSchema = string().optional()

export const jsonAttrOptionSchemas = {
  required: requiredSchema,
  hidden: hiddenSchema,
  key: keySchema,
  savedAs: savedAsSchema
}

export const defaulterSchema = map({ defaulterType: string().const('custom') })
export const linkerSchema = map({ linkerType: string().const('custom') })
