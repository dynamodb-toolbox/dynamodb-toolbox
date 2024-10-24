import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { number } from '~/attributes/number/index.js'
import { string } from '~/attributes/string/index.js'

import { attrStateDTOAttributes } from './state.js'

/**
 * @debt feature "Validate default value types w. `validate(...)`"
 */
export const setAttrDTOSchema = map({
  type: string().const('set'),
  ...attrStateDTOAttributes,
  elements: anyOf(
    map({
      type: string().const('number'),
      required: string().optional().const('atLeastOnce'),
      hidden: boolean().optional().const(false),
      key: boolean().optional().const(false),
      enum: list(anyOf(number(), string())).optional(),
      big: boolean().optional()
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
