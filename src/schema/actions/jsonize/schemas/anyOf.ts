import { any } from '~/attributes/any/index.js'
import { anyOf } from '~/attributes/anyOf/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { record } from '~/attributes/record/index.js'
import { string } from '~/attributes/string/index.js'

import { defaulterSchema, jsonAttrOptionSchemas, linkerSchema } from './common.js'

/**
 * @debt feature "Validate element types + constraints & default value types with `.validate` (lazily re-use attrRepresentationSchema)"
 */
export const jsonAnyOfAttrSchema = map({
  type: string().const('anyOf'),
  ...jsonAttrOptionSchemas,
  elements: list(any()),
  defaults: record(
    string().enum('put', 'key', 'update'),
    anyOf(map({ type: string().const('value'), value: any() }), defaulterSchema)
  ).optional(),
  links: record(string().enum('put', 'key', 'update'), linkerSchema).optional()
})
