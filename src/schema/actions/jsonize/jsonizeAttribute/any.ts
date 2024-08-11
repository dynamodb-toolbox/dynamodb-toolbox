import type { AnyAttribute } from '~/attributes/any/index.js'
import { ANY_DEFAULT_OPTIONS } from '~/attributes/any/options.js'

import type { JSONizedAttr } from '../schemas/index.js'

/**
 * @debt feature "handle defaults, links & validators"
 */
export const jsonizeAnyAttribute = (attr: AnyAttribute): JSONizedAttr => ({
  type: 'any',
  ...(attr.required !== ANY_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
  ...(attr.hidden !== ANY_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
  ...(attr.key !== ANY_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
  ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {})
})
