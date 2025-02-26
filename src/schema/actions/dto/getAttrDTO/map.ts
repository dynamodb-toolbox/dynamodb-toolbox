import type { MapSchema } from '~/attributes/map/index.js'

import type { MapAttrDTO } from '../types.js'
import { getAttrDTO } from './attribute.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getMapAttrDTO = (attr: MapSchema): MapAttrDTO => {
  const defaultsDTO = getDefaultsDTO(attr)
  const { required, hidden, key, savedAs } = attr.state

  return {
    type: 'map',
    attributes: Object.fromEntries(
      Object.entries(attr.attributes).map(([attributeName, attribute]) => [
        attributeName,
        getAttrDTO(attribute)
      ])
    ),
    ...(required !== undefined && required !== 'atLeastOnce' ? { required } : {}),
    ...(hidden !== undefined && hidden ? { hidden } : {}),
    ...(key !== undefined && key ? { key } : {}),
    ...(savedAs !== undefined ? { savedAs } : {}),
    ...defaultsDTO
  }
}
