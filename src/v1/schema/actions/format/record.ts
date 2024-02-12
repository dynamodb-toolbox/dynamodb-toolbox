import type { RecordAttribute, AttributeValue, RecordAttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatOptions } from './schema'
import { formatSavedPrimitiveAttribute } from './primitive'
import { formatSavedAttribute } from './attribute'
import { matchProjection } from './utils'

export const formatSavedRecordAttribute = (
  attribute: RecordAttribute,
  savedValue: AttributeValue,
  { attributes, ...restOptions }: FormatOptions
): RecordAttributeValue => {
  if (!isObject(savedValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: {
        received: savedValue,
        expected: type
      }
    })
  }

  const formattedRecord: RecordAttributeValue = {}

  Object.entries(savedValue).forEach(([key, element]) => {
    const parsedKey = formatSavedPrimitiveAttribute(attribute.keys, key) as string

    // We don't need isProjected: We used the saved value key so we know it is
    const { childrenAttributes } = matchProjection(new RegExp('^\\.' + parsedKey), attributes)

    const formattedAttribute = formatSavedAttribute(attribute.elements, element, {
      attributes: childrenAttributes,
      ...restOptions
    })

    if (formattedAttribute !== undefined) {
      formattedRecord[parsedKey] = formattedAttribute
    }
  })

  return formattedRecord
}
