import type { RequiredOption, Attribute, ResolvedAttribute, AdditionalResolution } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import { parsePrimitiveAttributeClonedInput } from './primitive'
import { parseSetAttributeClonedInput } from './set'
import { parseListAttributeClonedInput } from './list'
import { parseMapAttributeClonedInput } from './map'
import { parseRecordAttributeClonedInput } from './record'
import { parseAnyOfAttributeClonedInput } from './anyOf'
import type { ParsingOptions, ParsedAttributeInput } from './types'

const defaultRequiringOptions = new Set<RequiredOption>(['atLeastOnce', 'always'])

export const parseAttributeClonedInput = <ADDITIONAL_RESOLUTION extends AdditionalResolution>(
  attribute: Attribute,
  input: ResolvedAttribute<ADDITIONAL_RESOLUTION>,
  parsingOptions: ParsingOptions = {}
): ParsedAttributeInput<ADDITIONAL_RESOLUTION> => {
  const { requiringOptions = defaultRequiringOptions } = parsingOptions

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
