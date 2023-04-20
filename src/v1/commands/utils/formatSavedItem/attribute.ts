import cloneDeep from 'lodash.clonedeep'

import type { Attribute, RequiredOption, PossiblyUndefinedResolvedAttribute } from 'v1/item'

import { parseSavedPrimitiveAttribute } from './primitive'
import { parseSavedSetAttribute } from './set'
import { parseSavedListAttribute } from './list'
import { parseSavedMapAttribute } from './map'
import { parseSavedAnyOfAttribute } from './anyOf'
import { parseSavedRecordAttribute } from './record'

export const requiringOptions = new Set<RequiredOption>(['always', 'onlyOnce', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

export const parseSavedAttribute = (
  attribute: Attribute,
  value: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (value === undefined) {
    if (isRequired(attribute)) {
      // TODO
      throw new Error()
    } else {
      return undefined
    }
  }

  switch (attribute.type) {
    case 'any':
      return cloneDeep(value)
    case 'string':
    case 'binary':
    case 'boolean':
    case 'number':
      return parseSavedPrimitiveAttribute(attribute, value)
    case 'set':
      return parseSavedSetAttribute(attribute, value)
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
