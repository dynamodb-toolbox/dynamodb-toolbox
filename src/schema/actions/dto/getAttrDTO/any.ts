import type { AnyAttribute } from '~/attributes/any/index.js'
import { ANY_DEFAULT_OPTIONS } from '~/attributes/any/options.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { AnyAttrDTO } from '../types.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getAnyAttrDTO = (attr: AnyAttribute): AnyAttrDTO => {
  const defaultsDTO = getDefaultsDTO(attr)

  return {
    type: 'any',
    ...(attr.required !== ANY_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== ANY_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== ANY_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(defaultsDTO) ? { defaults: defaultsDTO } : {})
  }
}
