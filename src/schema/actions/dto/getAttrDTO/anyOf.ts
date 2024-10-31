import type { AnyOfAttribute } from '~/attributes/anyOf/index.js'
import { ANY_OF_DEFAULT_OPTIONS } from '~/attributes/anyOf/options.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { AnyOfAttrDTO } from '../types.js'
import { getAttrDTO } from './attribute.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getAnyOfAttrDTO = (attr: AnyOfAttribute): AnyOfAttrDTO => {
  const defaultsDTO = getDefaultsDTO(attr)

  return {
    type: 'anyOf',
    elements: attr.elements.map(getAttrDTO) as AnyOfAttrDTO['elements'],
    ...(attr.required !== ANY_OF_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== ANY_OF_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== ANY_OF_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(defaultsDTO) ? { defaults: defaultsDTO } : {})
  }
}
