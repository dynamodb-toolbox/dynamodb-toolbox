import type { RecordAttribute, PossiblyUndefinedResolvedMapAttribute } from 'v1/item'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameRecordAttributeSavedAsAttributes = (
  recordAttribute: RecordAttribute,
  input: PossiblyUndefinedResolvedMapAttribute
) => {
  Object.entries(input).forEach(([key, elementInput]) => {
    input[key] = renameAttributeSavedAsAttributes(recordAttribute.elements, elementInput)
  })

  return input
}
