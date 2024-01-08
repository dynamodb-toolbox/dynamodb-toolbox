import type { AttributeValue, AnyOfAttribute } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { formatSavedAttribute } from './attribute'
import { getItemKey } from './utils'

export const formatSavedAnyOfAttribute = (
  anyOfAttribute: AnyOfAttribute,
  savedValue: AttributeValue,
  options: FormatSavedAttributeOptions = {}
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
    const { partitionKey, sortKey } = options

    throw new DynamoDBToolboxError('operations.formatSavedItem.invalidSavedAttribute', {
      message: [
        `Saved item attribute does not match any of the possible sub-types: ${anyOfAttribute.path}.`,
        getItemKey({ partitionKey, sortKey })
      ]
        .filter(Boolean)
        .join(' '),
      path: anyOfAttribute.path,
      payload: {
        received: savedValue,
        partitionKey,
        sortKey
      }
    })
  }

  return parsedAttribute
}
