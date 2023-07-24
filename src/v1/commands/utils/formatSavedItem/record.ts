import type { RecordAttribute, PossiblyUndefinedAttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { parseSavedPrimitiveAttribute } from './primitive'
import { parseSavedAttribute } from './attribute'
import { matchProjection } from './utils'

export const parseSavedRecordAttribute = (
  recordAttribute: RecordAttribute,
  value: PossiblyUndefinedAttributeValue,
  { projectedAttributes, ...restOptions }: FormatSavedAttributeOptions
): PossiblyUndefinedAttributeValue => {
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

  const formattedRecord: PossiblyUndefinedAttributeValue = {}

  Object.entries(value).forEach(([key, element]) => {
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
