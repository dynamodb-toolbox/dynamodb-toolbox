import type { RecordAttribute, AttributeValue, RecordAttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatOptions } from './schema'
import { formatSavedPrimitiveAttribute } from './primitive'
import { formatSavedAttribute } from './attribute'
import { matchProjection } from './utils'

export const formatSavedRecordAttribute = (
  recordAttribute: RecordAttribute,
  savedValue: AttributeValue,
  { attributes, ...restOptions }: FormatOptions
): RecordAttributeValue => {
  if (!isObject(savedValue)) {
    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute in saved item: ${recordAttribute.path}. Should be a ${recordAttribute.type}.`,
      path: recordAttribute.path,
      payload: {
        received: savedValue,
        expected: recordAttribute.type
      }
    })
  }

  const formattedRecord: RecordAttributeValue = {}

  Object.entries(savedValue).forEach(([key, element]) => {
    const parsedKey = formatSavedPrimitiveAttribute(recordAttribute.keys, key) as string

    // We don't need isProjected: We used the saved value key so we know it is
    const { childrenAttributes } = matchProjection(new RegExp('^\\.' + parsedKey), attributes)

    const formattedAttribute = formatSavedAttribute(recordAttribute.elements, element, {
      attributes: childrenAttributes,
      ...restOptions
    })

    if (formattedAttribute !== undefined) {
      formattedRecord[parsedKey] = formattedAttribute
    }
  })

  return formattedRecord
}
