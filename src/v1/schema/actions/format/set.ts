import type { SetAttribute, AttributeValue, SetAttributeValue } from 'v1/schema'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatOptions } from './schema'
import { formatSavedAttribute } from './attribute'

export const formatSavedSetAttribute = (
  attribute: SetAttribute,
  savedValue: AttributeValue,
  options: FormatOptions = {}
): SetAttributeValue => {
  if (!isSet(savedValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path: path,
      payload: {
        received: savedValue,
        expected: type
      }
    })
  }

  const parsedPutItemInput: SetAttributeValue = new Set()

  for (const savedElement of savedValue) {
    const parsedElement = formatSavedAttribute(attribute.elements, savedElement, options)

    if (parsedElement !== undefined) {
      parsedPutItemInput.add(parsedElement)
    }
  }

  return parsedPutItemInput
}
