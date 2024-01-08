import type { RecordAttribute, AttributeValue, RecordAttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { formatSavedPrimitiveAttribute } from './primitive'
import { formatSavedAttribute } from './attribute'
import { matchProjection, getItemKey } from './utils'

export const formatSavedRecordAttribute = (
  recordAttribute: RecordAttribute,
  savedValue: AttributeValue,
  { projectedAttributes, ...restOptions }: FormatSavedAttributeOptions
): RecordAttributeValue => {
  if (!isObject(savedValue)) {
    const { partitionKey, sortKey } = restOptions

    throw new DynamoDBToolboxError('operations.formatSavedItem.invalidSavedAttribute', {
      message: [
        `Invalid attribute in saved item: ${recordAttribute.path}. Should be a ${recordAttribute.type}.`,
        getItemKey({ partitionKey, sortKey })
      ]
        .filter(Boolean)
        .join(' '),
      path: recordAttribute.path,
      payload: {
        received: savedValue,
        expected: recordAttribute.type,
        partitionKey,
        sortKey
      }
    })
  }

  const formattedRecord: RecordAttributeValue = {}

  Object.entries(savedValue).forEach(([key, element]) => {
    const parsedKey = formatSavedPrimitiveAttribute(
      recordAttribute.keys,
      key,
      restOptions
    ) as string

    // We don't need isProjected: We used the saved value key so we know it is
    const { childrenAttributes } = matchProjection(
      new RegExp('^\\.' + parsedKey),
      projectedAttributes
    )

    const formattedAttribute = formatSavedAttribute(recordAttribute.elements, element, {
      projectedAttributes: childrenAttributes,
      ...restOptions
    })

    if (formattedAttribute !== undefined) {
      formattedRecord[parsedKey] = formattedAttribute
    }
  })

  return formattedRecord
}
