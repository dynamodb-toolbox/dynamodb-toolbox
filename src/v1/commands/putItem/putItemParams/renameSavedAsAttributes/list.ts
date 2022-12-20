import { ListAttribute, PossiblyUndefinedResolvedListAttribute } from 'v1'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameListAttributeSavedAsAttributes = (
  listAttribute: ListAttribute,
  input: PossiblyUndefinedResolvedListAttribute
): PossiblyUndefinedResolvedListAttribute =>
  input.map(element => renameAttributeSavedAsAttributes(listAttribute.elements, element))
