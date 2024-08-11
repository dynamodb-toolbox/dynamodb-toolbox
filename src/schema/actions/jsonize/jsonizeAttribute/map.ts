import type { MapAttribute } from '~/attributes/map/index.js'
import { MAP_DEFAULT_OPTIONS } from '~/attributes/map/options.js'

import type { JSONizedAttr } from '../schemas/index.js'
import { jsonizeAttribute } from './attribute.js'

export const jsonizeMapAttribute = (attr: MapAttribute): JSONizedAttr => ({
  type: 'map',
  ...(attr.required !== MAP_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
  ...(attr.hidden !== MAP_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
  ...(attr.key !== MAP_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
  ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
  attributes: Object.fromEntries(
    Object.entries(attr.attributes).map(([attributeName, attribute]) => [
      attributeName,
      jsonizeAttribute(attribute)
    ])
  )
})
