import cloneDeep from 'lodash.clonedeep'

import { Attribute, ResolvedAttribute } from 'v1/item'

import { parseSavedListAttribute } from './list'
import { parseSavedMapAttribute } from './map'

export const parseSavedAttribute = (
  attribute: Attribute,
  value: ResolvedAttribute
): ResolvedAttribute => {
  switch (attribute.type) {
    case 'any':
    case 'constant':
    case 'string':
    case 'binary':
    case 'boolean':
    case 'number':
    case 'set':
      return cloneDeep(value)
    case 'list':
      return parseSavedListAttribute(attribute, value)
    case 'map':
      return parseSavedMapAttribute(attribute, value)
  }
}
