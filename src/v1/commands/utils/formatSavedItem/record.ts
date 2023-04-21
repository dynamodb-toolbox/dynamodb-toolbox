import type {
  RecordAttribute,
  PossiblyUndefinedResolvedAttribute,
  PossiblyUndefinedResolvedMapAttribute
} from 'v1/item'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseSavedAttribute } from './attribute'

export const parseSavedRecordAttribute = (
  recordAttribute: RecordAttribute,
  value: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isObject(value)) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${recordAttribute.path}. Should be a ${recordAttribute.type}`,
      path: recordAttribute.path,
      payload: {
        received: value,
        expected: recordAttribute.type
      }
    })
  }

  const formattedRecord: PossiblyUndefinedResolvedMapAttribute = {}

  Object.entries(value).forEach(([key, element]) => {
    formattedRecord[parseSavedAttribute(recordAttribute.keys, key) as string] = parseSavedAttribute(
      recordAttribute.elements,
      element
    )
  })

  return formattedRecord
}
