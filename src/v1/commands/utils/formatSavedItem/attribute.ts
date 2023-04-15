import cloneDeep from 'lodash.clonedeep'

import { Attribute, ResolvedAttribute } from 'v1/item'

import { parseSavedListAttribute } from './list'
import { parseSavedMapAttribute } from './map'
import { parseSavedAnyOfAttribute } from './anyOf'
import { parseSavedRecordAttribute } from './record'

export const parseSavedAttribute = (
  attribute: Attribute,
  value: ResolvedAttribute
): ResolvedAttribute => {
  switch (attribute.type) {
    case 'any':
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
    case 'record':
      return parseSavedRecordAttribute(attribute, value)
    case 'anyOf':
      return parseSavedAnyOfAttribute(attribute, value)
  }
}
