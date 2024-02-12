import type { AttributeValue, AnyOfAttribute } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatOptions } from './schema'
import { formatSavedAttribute } from './attribute'

export const formatSavedAnyOfAttribute = (
  attribute: AnyOfAttribute,
  savedValue: AttributeValue,
  options: FormatOptions = {}
): AttributeValue => {
  let parsedAttribute: AttributeValue | undefined = undefined

  for (const element of attribute.elements) {
    try {
      parsedAttribute = formatSavedAttribute(element, savedValue, options)
      break
    } catch (error) {
      continue
    }
  }

  if (parsedAttribute === undefined) {
    const { path } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting. Attribute does not match any of the possible sub-types${
        path !== undefined ? `: '${path}'` : ''
      }.`,
      path,
      payload: {
        received: savedValue
      }
    })
  }

  return parsedAttribute
}
