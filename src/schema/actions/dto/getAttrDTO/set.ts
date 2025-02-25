import type { SetAttribute } from '~/attributes/set/index.js'

import type { SetAttrDTO } from '../types.js'
import { getAttrDTO } from './attribute.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getSetAttrDTO = (attr: SetAttribute): SetAttrDTO => {
  const defaultsDTO = getDefaultsDTO(attr)
  const { required, hidden, key, savedAs } = attr.state

  return {
    type: attr.type,
    elements: getAttrDTO(attr.elements) as SetAttrDTO['elements'],
    ...(required !== undefined && required !== 'atLeastOnce' ? { required } : {}),
    ...(hidden !== undefined && hidden ? { hidden } : {}),
    ...(key !== undefined && key ? { key } : {}),
    ...(savedAs !== undefined ? { savedAs } : {}),
    ...defaultsDTO
  }
}
