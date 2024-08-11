import type { AnyOfAttribute } from '~/attributes/anyOf/index.js'
import { ANY_OF_DEFAULT_OPTIONS } from '~/attributes/anyOf/options.js'
import type { AnyOfAttributeElementConstraints } from '~/attributes/anyOf/types.js'

import type { JSONizedAttr } from '../schemas/index.js'
import { jsonizeAttribute } from './attribute.js'

/**
 * @debt feature "handle defaults, links & validators"
 */
export const jsonizeAnyOfAttribute = (attr: AnyOfAttribute): JSONizedAttr => ({
  type: 'anyOf',
  ...(attr.required !== ANY_OF_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
  ...(attr.hidden !== ANY_OF_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
  ...(attr.key !== ANY_OF_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
  ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
  elements: attr.elements.map(jsonizeAttribute) as (JSONizedAttr &
    Partial<AnyOfAttributeElementConstraints>)[]
})
