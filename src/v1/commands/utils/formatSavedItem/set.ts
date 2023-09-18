import type { SetAttribute, AttributeValue, SetAttributeValue } from 'v1/schema'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseSavedAttribute } from './attribute'

export const parseSavedSetAttribute = (
  setAttribute: SetAttribute,
  savedSet: AttributeValue
): SetAttributeValue => {
  if (!isSet(savedSet)) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${setAttribute.path}. Should be a ${setAttribute.type}`,
      path: setAttribute.path,
      payload: {
        received: savedSet,
        expected: setAttribute.type
      }
    })
  }

  const parsedPutItemInput: SetAttributeValue = new Set()

  for (const savedElement of savedSet) {
    const parsedElement = parseSavedAttribute(setAttribute.elements, savedElement)

    if (parsedElement !== undefined) {
      parsedPutItemInput.add(parsedElement)
    }
  }

  return parsedPutItemInput
}
