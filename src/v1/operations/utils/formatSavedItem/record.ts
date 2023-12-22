import type { RecordAttribute, AttributeValue, RecordAttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { parseSavedPrimitiveAttribute } from './primitive'
import { parseSavedAttribute } from './attribute'
import { matchProjection } from './utils'

export const parseSavedRecordAttribute = (
  recordAttribute: RecordAttribute,
  savedRecord: AttributeValue,
  { projectedAttributes, ...restOptions }: FormatSavedAttributeOptions
): RecordAttributeValue => {
  if (!isObject(savedRecord)) {
    throw new DynamoDBToolboxError('operations.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${recordAttribute.path}. Should be a ${recordAttribute.type}`,
      path: recordAttribute.path,
      payload: {
        received: savedRecord,
        expected: recordAttribute.type
      }
    })
  }

  const formattedRecord: RecordAttributeValue = {}

  Object.entries(savedRecord).forEach(([key, element]) => {
    const parsedKey = parseSavedPrimitiveAttribute(recordAttribute.keys, key) as string

    // We don't need isProjected: We used the saved value key so we know it is
    const { childrenAttributes } = matchProjection(
      new RegExp('^\\.' + parsedKey),
      projectedAttributes
    )

    const formattedAttribute = parseSavedAttribute(recordAttribute.elements, element, {
      projectedAttributes: childrenAttributes,
      ...restOptions
    })

    if (formattedAttribute !== undefined) {
      formattedRecord[parsedKey] = formattedAttribute
    }
  })

  return formattedRecord
}
