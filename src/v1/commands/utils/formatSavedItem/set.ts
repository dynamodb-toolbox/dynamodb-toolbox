import type { SetAttribute, PossiblyUndefinedAttributeValue } from 'v1/schema'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseSavedAttribute } from './attribute'

export const parseSavedSetAttribute = (
  setAttribute: SetAttribute,
  value: PossiblyUndefinedAttributeValue
): PossiblyUndefinedAttributeValue => {
  if (!isSet(value)) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${setAttribute.path}. Should be a ${setAttribute.type}`,
      path: setAttribute.path,
      payload: {
        received: value,
        expected: setAttribute.type
      }
    })
  }

  const parsedPutItemInput: PossiblyUndefinedAttributeValue = new Set()

  value.forEach(element =>
    parsedPutItemInput.add(parseSavedAttribute(setAttribute.elements, element))
  )

  return parsedPutItemInput
}
