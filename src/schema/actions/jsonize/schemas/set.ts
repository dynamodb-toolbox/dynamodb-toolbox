import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { number } from '~/attributes/number/index.js'
import { record } from '~/attributes/record/index.js'
import { string } from '~/attributes/string/index.js'

import { defaulterSchema, jsonAttrOptionSchemas, linkerSchema } from './common.js'

/**
 * @debt feature "Validate the enum & default value types w. `validate(...)`"
 */
export const setAttrJSONRepresentationSchema = map({
  type: string().const('set'),
  ...jsonAttrOptionSchemas,
  elements: map({
    type: string().const('number'),
    required: string().optional().const('atLeastOnce'),
    hidden: boolean().optional().const(false),
    key: boolean().optional().const(false),
    /**
     * @debt feature "Validate unicity with `.validate`"
     */
    enum: list(anyOf(number(), string())).optional()
  }),
  defaults: record(
    string().enum('put', 'key', 'update'),
    anyOf(
      /**
       * @debt feature "Validate unicity with `.validate`"
       */
      map({ type: string().const('value'), value: list(anyOf(number(), string())) }),
      defaulterSchema
    )
  ).optional(),
  links: record(string().enum('put', 'key', 'update'), linkerSchema).optional()
})
