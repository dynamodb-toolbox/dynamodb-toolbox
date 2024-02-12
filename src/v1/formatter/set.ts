import type { SetAttribute, AttributeValue, SetAttributeValue } from 'v1/schema'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatOptions } from './schema'
import { formatSavedAttribute } from './attribute'

export const formatSavedSetAttribute = (
  setAttribute: SetAttribute,
  savedValue: AttributeValue,
  options: FormatOptions = {}
): SetAttributeValue => {
  if (!isSet(savedValue)) {
    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute in saved item: ${setAttribute.path}. Should be a ${setAttribute.type}.`,
      path: setAttribute.path,
      payload: {
        received: savedValue,
        expected: setAttribute.type
      }
    })
  }

  const parsedPutItemInput: SetAttributeValue = new Set()

  for (const savedElement of savedValue) {
    const parsedElement = formatSavedAttribute(setAttribute.elements, savedElement, options)

    if (parsedElement !== undefined) {
      parsedPutItemInput.add(parsedElement)
    }
  }

  return parsedPutItemInput
}
