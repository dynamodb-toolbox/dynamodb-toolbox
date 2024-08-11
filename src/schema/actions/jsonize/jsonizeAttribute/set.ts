import type { SetAttribute } from '~/attributes/set/index.js'
import { SET_DEFAULT_OPTIONS } from '~/attributes/set/options.js'

import type { JSONizedAttr } from '../schemas/index.js'
import { jsonizeAttribute } from './attribute.js'

/**
 * @debt feature "handle defaults, links & validators"
 */
export const jsonizeSetAttribute = (attr: SetAttribute): JSONizedAttr =>
  ({
    type: attr.type,
    ...(attr.required !== SET_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== SET_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== SET_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    elements: jsonizeAttribute(attr.elements)
    // We need to cast as `JSONizedAttr` is not assignable to set elements
  }) as Extract<JSONizedAttr, { type: 'set' }>
