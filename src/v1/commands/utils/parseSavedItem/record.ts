import { RecordAttribute, ResolvedAttribute, ResolvedMapAttribute } from 'v1/item'
import { isObject } from 'v1/utils/validation'

import { parseSavedAttribute } from './attribute'

export const parseSavedRecordAttribute = (
  recordAttribute: RecordAttribute,
  savedItem: ResolvedAttribute
): ResolvedAttribute => {
  if (!isObject(savedItem)) {
    // TODO
    throw new Error()
  }

  const formattedRecord: ResolvedMapAttribute = {}

  Object.entries(savedItem).forEach(([key, element]) => {
    formattedRecord[parseSavedAttribute(recordAttribute.keys, key) as string] = parseSavedAttribute(
      recordAttribute.elements,
      element
    )
  })

  return formattedRecord
}
