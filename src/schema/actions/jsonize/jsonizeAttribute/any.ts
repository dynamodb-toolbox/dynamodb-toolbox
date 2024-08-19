import type { AnyAttribute } from '~/attributes/any/index.js'
import { ANY_DEFAULT_OPTIONS } from '~/attributes/any/options.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { JSONizedAttr } from '../schema/index.js'
import { jsonizeDefaults } from './utils.js'

/**
 * @debt feature "handle JSONizable defaults, links & validators"
 */
export const jsonizeAnyAttribute = (attr: AnyAttribute): JSONizedAttr => {
  const jsonizedDefaults = jsonizeDefaults(attr)

  return {
    type: 'any',
    ...(attr.required !== ANY_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== ANY_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== ANY_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(jsonizedDefaults) ? { defaults: jsonizedDefaults } : {})
  }
}
