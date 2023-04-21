import type { SetAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseSavedAttribute } from './attribute'

export const parseSavedSetAttribute = (
  setAttribute: SetAttribute,
  value: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
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

  const parsedPutItemInput: PossiblyUndefinedResolvedAttribute = new Set()

  value.forEach(element =>
    parsedPutItemInput.add(parseSavedAttribute(setAttribute.elements, element))
  )

  return parsedPutItemInput
}
