import type {
  Attribute,
  PossiblyUndefinedResolvedAttribute,
  PossiblyUndefinedResolvedListAttribute,
  PossiblyUndefinedResolvedMapAttribute
} from 'v1/item'
import type { ParsedAnyOfAttributeCommandInput } from 'v1/commands/types'

import { renameListAttributeSavedAsAttributes } from './list'
import { renameMapAttributeSavedAsAttributes } from './map'
import { renameAnyOfAttributeSavedAsAttributes } from './anyOf'

export const renameAttributeSavedAsAttributes = (
  attribute: Attribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  switch (attribute.type) {
    case 'any':
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
      // TODO
      return input
    case 'anyOf':
      return renameAnyOfAttributeSavedAsAttributes(
        attribute,
        input as ParsedAnyOfAttributeCommandInput
      )
  }
}
