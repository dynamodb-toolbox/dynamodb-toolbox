import type { MapAttribute } from '~/attributes/map/index.js'
import { MAP_DEFAULT_OPTIONS } from '~/attributes/map/options.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { JSONizedAttr } from '../schema/index.js'
import { jsonizeAttribute } from './attribute.js'
import { jsonizeDefaults } from './utils.js'

/**
 * @debt feature "handle JSONizable defaults, links & validators"
 */
export const jsonizeMapAttribute = (attr: MapAttribute): JSONizedAttr => {
  const jsonizedDefaults = jsonizeDefaults(attr)

  return {
    type: 'map',
    attributes: Object.fromEntries(
      Object.entries(attr.attributes).map(([attributeName, attribute]) => [
        attributeName,
        jsonizeAttribute(attribute)
      ])
    ),
    ...(attr.required !== MAP_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
    ...(attr.hidden !== MAP_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
    ...(attr.key !== MAP_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
    ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
    ...(!isEmpty(jsonizedDefaults) ? { defaults: jsonizedDefaults } : {})
  }
}
