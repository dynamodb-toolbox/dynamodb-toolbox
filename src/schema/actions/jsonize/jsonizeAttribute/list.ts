import type { ListAttribute } from '~/attributes/list/index.js'
import { LIST_DEFAULT_OPTIONS } from '~/attributes/list/options.js'
import type { ListAttributeElementConstraints } from '~/attributes/list/types.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { JSONizedAttr } from '../schemas/index.js'
import { jsonizeAttribute } from './attribute.js'
import { jsonizeDefaults } from './utils.js'

/**
 * @debt feature "handle JSONizable defaults, links & validators"
 */
export const jsonizeListAttribute = (attr: ListAttribute): JSONizedAttr => {
  const jsonizedDefaults = jsonizeDefaults(attr)

  return {
    type: 'list',
    elements: jsonizeAttribute(attr.elements) as JSONizedAttr &
      Partial<ListAttributeElementConstraints>,
    ...(attr.required !== LIST_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== LIST_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== LIST_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(jsonizedDefaults) ? { defaults: jsonizedDefaults } : {})
  }
}
