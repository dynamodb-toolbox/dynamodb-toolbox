import type {
  RecordAttribute,
  PossiblyUndefinedResolvedAttribute,
  PossiblyUndefinedResolvedMapAttribute
} from 'v1/item'
import { isObject } from 'v1/utils/validation'

import { parseSavedAttribute } from './attribute'

export const parseSavedRecordAttribute = (
  recordAttribute: RecordAttribute,
  savedItem: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isObject(savedItem)) {
    // TODO
    throw new Error()
  }

  const formattedRecord: PossiblyUndefinedResolvedMapAttribute = {}

  Object.entries(savedItem).forEach(([key, element]) => {
    formattedRecord[parseSavedAttribute(recordAttribute.keys, key) as string] = parseSavedAttribute(
      recordAttribute.elements,
      element
    )
  })

  return formattedRecord
}
