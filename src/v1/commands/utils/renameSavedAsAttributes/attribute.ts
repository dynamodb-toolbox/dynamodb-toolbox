import {
  Attribute,
  PossiblyUndefinedResolvedAttribute,
  PossiblyUndefinedResolvedListAttribute,
  PossiblyUndefinedResolvedMapAttribute
} from 'v1'

import { renameListAttributeSavedAsAttributes } from './list'
import { renameMapAttributeSavedAsAttributes } from './map'

export const renameAttributeSavedAsAttributes = (
  attribute: Attribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  switch (attribute.type) {
    case 'any':
    case 'constant':
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
    case 'set':
      return input
    case 'list':
      return renameListAttributeSavedAsAttributes(
        attribute,
        input as PossiblyUndefinedResolvedListAttribute
      )
    case 'map':
      return renameMapAttributeSavedAsAttributes(
        attribute,
        input as PossiblyUndefinedResolvedMapAttribute
      )
    case 'record':
    case 'anyOf':
      // TODO
      return input
  }
}
