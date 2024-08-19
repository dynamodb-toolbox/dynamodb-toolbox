import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { number } from '~/attributes/number/index.js'
import { string } from '~/attributes/string/index.js'

import { jsonizedAttrOptionSchemas } from './common.js'

/**
 * @debt feature "Validate default value types w. `validate(...)`"
 */
export const jsonizedSetAttrSchema = map({
  type: string().const('set'),
  ...jsonizedAttrOptionSchemas,
  elements: anyOf(
    map({
      type: string().const('number'),
      required: string().optional().const('atLeastOnce'),
      hidden: boolean().optional().const(false),
      key: boolean().optional().const(false),
      enum: list(number()).optional()
    }),
    map({
      type: string().const('string'),
      required: string().optional().const('atLeastOnce'),
      hidden: boolean().optional().const(false),
      key: boolean().optional().const(false),
      enum: list(string()).optional()
    }),
    map({
      type: string().const('binary'),
      required: string().optional().const('atLeastOnce'),
      hidden: boolean().optional().const(false),
      key: boolean().optional().const(false),
      enum: list(string()).optional()
    })
  )
})
