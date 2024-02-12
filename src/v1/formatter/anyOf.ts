import type { AttributeValue, AnyOfAttribute } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatOptions } from './schema'
import { formatSavedAttribute } from './attribute'

export const formatSavedAnyOfAttribute = (
  anyOfAttribute: AnyOfAttribute,
  savedValue: AttributeValue,
  options: FormatOptions = {}
): AttributeValue => {
  let parsedAttribute: AttributeValue | undefined = undefined

  for (const element of anyOfAttribute.elements) {
    try {
      parsedAttribute = formatSavedAttribute(element, savedValue, options)
      break
    } catch (error) {
      continue
    }
  }

  if (parsedAttribute === undefined) {
    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Item attribute does not match any of the possible sub-types: ${anyOfAttribute.path}.`,
      path: anyOfAttribute.path,
      payload: {
        received: savedValue
      }
    })
  }

  return parsedAttribute
}
