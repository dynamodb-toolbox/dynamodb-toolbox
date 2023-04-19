import type { AnyOfAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import type { ParsedAnyOfAttributeCommandInput } from 'v1/commands/types'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameAnyOfAttributeSavedAsAttributes = (
  anyOfAttribute: AnyOfAttribute,
  { subSchemaIndex, parsedInput }: ParsedAnyOfAttributeCommandInput
): PossiblyUndefinedResolvedAttribute =>
  renameAttributeSavedAsAttributes(anyOfAttribute.elements[subSchemaIndex], parsedInput)
