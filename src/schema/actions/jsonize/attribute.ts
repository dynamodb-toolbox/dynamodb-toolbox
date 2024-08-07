import { ANY_DEFAULT_OPTIONS } from '~/attributes/any/options.js'
import { ANY_OF_DEFAULT_OPTIONS } from '~/attributes/anyOf/options.js'
import type { Attribute, PrimitiveAttributeType } from '~/attributes/index.js'
import { LIST_DEFAULT_OPTIONS } from '~/attributes/list/options.js'
import { MAP_DEFAULT_OPTIONS } from '~/attributes/map/options.js'
import { PRIMITIVE_DEFAULT_OPTIONS } from '~/attributes/primitive/options.js'
import { RECORD_DEFAULT_OPTIONS } from '~/attributes/record/options.js'
import { SET_DEFAULT_OPTIONS } from '~/attributes/set/options.js'

import type { JSONizedAttr } from './schemas/index.js'

export const jsonizeAttribute = (attr: Attribute): JSONizedAttr => {
  /**
   * @debt feature "handle defaults, links & transformers"
   */
  switch (attr.type) {
    case 'any':
      return {
        type: 'any',
        ...(attr.required !== ANY_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
        ...(attr.hidden !== ANY_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
        ...(attr.key !== ANY_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
        ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {})
      }
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return {
        type: attr.type,
        ...(attr.required !== PRIMITIVE_DEFAULT_OPTIONS.required
          ? { required: attr.required }
          : {}),
        ...(attr.hidden !== PRIMITIVE_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
        ...(attr.key !== PRIMITIVE_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
        ...(attr.enum !== undefined ? { enum: attr.enum } : {}),
        ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {})
        // We need to cast as `.enum` is not coupled to `.type`
      } as Extract<JSONizedAttr, { type: PrimitiveAttributeType }>
    case 'set':
      return {
        type: attr.type,
        ...(attr.required !== SET_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
        ...(attr.hidden !== SET_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
        ...(attr.key !== SET_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
        ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
        elements: jsonizeAttribute(attr.elements)
        // We need to cast as `JSONizedAttr` is not assignable to set elements
      } as Extract<JSONizedAttr, { type: 'set' | 'list' }>
    case 'list':
      return {
        type: 'list',
        ...(attr.required !== LIST_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
        ...(attr.hidden !== LIST_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
        ...(attr.key !== LIST_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
        ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
        elements: jsonizeAttribute(attr.elements)
      }
    case 'map':
      return {
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
      }
    case 'record':
      return {
        type: 'record',
        ...(attr.required !== RECORD_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
        ...(attr.hidden !== RECORD_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
        ...(attr.key !== RECORD_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
        ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
        keys: jsonizeAttribute(attr.keys),
        elements: jsonizeAttribute(attr.elements)
        // We need to cast as `JSONizedAttr` is not assignable to record keys
      } as Extract<JSONizedAttr, { type: 'record' }>
    case 'anyOf':
      return {
        type: 'anyOf',
        ...(attr.required !== ANY_OF_DEFAULT_OPTIONS.required ? { required: attr.required } : {}),
        ...(attr.hidden !== ANY_OF_DEFAULT_OPTIONS.hidden ? { hidden: attr.hidden } : {}),
        ...(attr.key !== ANY_OF_DEFAULT_OPTIONS.key ? { key: attr.key } : {}),
        ...(attr.savedAs !== undefined ? { savedAs: attr.savedAs } : {}),
        elements: attr.elements.map(jsonizeAttribute)
      }
  }
}
