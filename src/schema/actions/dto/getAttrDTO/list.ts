import type { ListSchema } from '~/attributes/list/index.js'

import type { ListAttrDTO } from '../types.js'
import { getAttrDTO } from './attribute.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getListAttrDTO = (attr: ListSchema): ListAttrDTO => {
  const defaultsDTO = getDefaultsDTO(attr)
  const { required, hidden, key, savedAs } = attr.state

  return {
    type: 'list',
    elements: getAttrDTO(attr.elements) as ListAttrDTO['elements'],
    ...(required !== undefined && required !== 'atLeastOnce' ? { required } : {}),
    ...(hidden !== undefined && hidden ? { hidden } : {}),
    ...(key !== undefined && key ? { key } : {}),
    ...(savedAs !== undefined ? { savedAs } : {}),
    ...defaultsDTO
  }
}
