import type { PossiblyUndefinedResolvedAttribute, AnyOfAttribute } from 'v1/item'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseSavedAttribute } from './attribute'

export const parseSavedAnyOfAttribute = (
  anyOfAttribute: AnyOfAttribute,
  value: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  let parsedAttribute: PossiblyUndefinedResolvedAttribute | undefined = undefined

  for (const element of anyOfAttribute.elements) {
    try {
      parsedAttribute = parseSavedAttribute(element, value)
      break
    } catch (error) {
      continue
    }
  }

  if (parsedAttribute === undefined) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Saved item attribute does not match any of the possible sub-types: ${anyOfAttribute.path}`,
      path: anyOfAttribute.path,
      payload: {
        received: value
      }
    })
  }

  return parsedAttribute
}
