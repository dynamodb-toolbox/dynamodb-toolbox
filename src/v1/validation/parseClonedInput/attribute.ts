import type { Attribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { DynamoDBToolboxError } from 'v1/errors'

import { parsePrimitiveAttributeClonedInput } from './primitive'
import { parseSetAttributeClonedInput } from './set'
import { parseListAttributeClonedInput } from './list'
import { parseMapAttributeClonedInput } from './map'
import { parseRecordAttributeClonedInput } from './record'
import { parseAnyOfAttributeClonedInput } from './anyOf'
import type { ParsingOptions } from './types'

export const parseAttributeClonedInput = (
  attribute: Attribute,
  input: PossiblyUndefinedResolvedAttribute,
  parsingOptions: ParsingOptions
): PossiblyUndefinedResolvedAttribute => {
  const { requiringOptions } = parsingOptions

  if (input === undefined) {
    if (requiringOptions.has(attribute.required)) {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute ${attribute.path} is required`,
        path: attribute.path
      })
    } else {
      return undefined
    }
  }

  switch (attribute.type) {
    case 'any':
      return input
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return parsePrimitiveAttributeClonedInput(attribute, input)
    case 'set':
      return parseSetAttributeClonedInput(attribute, input, parsingOptions)
    case 'list':
      return parseListAttributeClonedInput(attribute, input, parsingOptions)
    case 'map':
      return parseMapAttributeClonedInput(attribute, input, parsingOptions)
    case 'record':
      return parseRecordAttributeClonedInput(attribute, input, parsingOptions)
    case 'anyOf':
      return parseAnyOfAttributeClonedInput(attribute, input, parsingOptions)
  }
}
