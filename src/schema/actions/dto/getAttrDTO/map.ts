import type { MapAttribute } from '~/attributes/map/index.js'
import { MAP_DEFAULT_OPTIONS } from '~/attributes/map/options.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { MapAttrDTO } from '../types.js'
import { getAttrDTO } from './attribute.js'
import { getDefaultsDTO } from './utils.js'

/**
 * @debt feature "handle defaults, links & validators DTOs"
 */
export const getMapAttrDTO = (attr: MapAttribute): MapAttrDTO => {
  const defaultsDTO = getDefaultsDTO(attr)

  return {
    type: 'map',
    attributes: Object.fromEntries(
      Object.entries(attr.attributes).map(([attributeName, attribute]) => [
        attributeName,
        getAttrDTO(attribute)
      ])
    ),
    ...(attr.required !== MAP_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== MAP_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== MAP_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(defaultsDTO) ? { defaults: defaultsDTO } : {})
  }
}
