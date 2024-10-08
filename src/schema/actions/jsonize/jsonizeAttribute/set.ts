import type { SetAttribute } from '~/attributes/set/index.js'
import { SET_DEFAULT_OPTIONS } from '~/attributes/set/options.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { JSONizedAttr } from '../schema/index.js'
import { jsonizeAttribute } from './attribute.js'
import { jsonizeDefaults } from './utils.js'

/**
 * @debt feature "handle JSONizable defaults, links & validators"
 */
export const jsonizeSetAttribute = (attr: SetAttribute): JSONizedAttr => {
  const jsonizedDefaults = jsonizeDefaults(attr)

  return {
    type: attr.type,
    elements: jsonizeAttribute(attr.elements),
    ...(attr.required !== SET_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== SET_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== SET_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(jsonizedDefaults) ? { defaults: jsonizedDefaults } : {})
    // We need to cast as `JSONizedAttr` is not assignable to set elements
  } as Extract<JSONizedAttr, { type: 'set' }>
}
