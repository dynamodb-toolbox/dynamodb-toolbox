import { any } from '~/attributes/any/index.js'
import { anyOf } from '~/attributes/anyOf/index.js'
import { map } from '~/attributes/map/index.js'
import { record } from '~/attributes/record/index.js'
import { string } from '~/attributes/string/index.js'

import { defaulterSchema, jsonAttrOptionSchemas, linkerSchema } from './common.js'

/**
 * @debt feature "Validate attribute types + constraints (like no duplicate savedAs) & default value types with `.validate` (lazily re-use attrRepresentationSchema)"
 */
export const jsonMapAttrSchema = map({
  type: string().const('map'),
  ...jsonAttrOptionSchemas,
  attributes: record(string(), any()),
  defaults: record(
    string().enum('put', 'key', 'update'),
    anyOf(map({ type: string().const('value'), value: record(string(), any()) }), defaulterSchema)
  ).optional(),
  links: record(string().enum('put', 'key', 'update'), linkerSchema).optional()
})
