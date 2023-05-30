import type { PossiblyUndefinedResolvedAttribute, AnyOfAttribute } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { parseSavedAttribute } from './attribute'

export const parseSavedAnyOfAttribute = (
  anyOfAttribute: AnyOfAttribute,
  value: PossiblyUndefinedResolvedAttribute,
  options: FormatSavedAttributeOptions
): PossiblyUndefinedResolvedAttribute => {
  let parsedAttribute: PossiblyUndefinedResolvedAttribute | undefined = undefined

  for (const element of anyOfAttribute.elements) {
    try {
      parsedAttribute = parseSavedAttribute(element, value, options)
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
