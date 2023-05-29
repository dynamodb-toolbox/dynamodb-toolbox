import type {
  Attribute,
  PossiblyUndefinedResolvedAttribute,
  PossiblyUndefinedResolvedListAttribute,
  PossiblyUndefinedResolvedMapAttribute
} from 'v1/schema'
import type { ParsedAnyOfAttributeCommandInput } from 'v1/commands/types/intermediaryAnyOfAttributeState'

import { renameListAttributeSavedAsAttributes } from './list'
import { renameRecordAttributeSavedAsAttributes } from './record'
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
      return renameRecordAttributeSavedAsAttributes(
        attribute,
        input as PossiblyUndefinedResolvedMapAttribute
      )
    case 'anyOf':
      return renameAnyOfAttributeSavedAsAttributes(
        attribute,
        input as ParsedAnyOfAttributeCommandInput
      )
  }
}
