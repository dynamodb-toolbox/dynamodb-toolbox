import type {
  RequiredOption,
  Attribute,
  Extension,
  AttributeValue,
  AttributeBasicValue
} from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsingOptions, AttributeParsedValue } from './types'
import { parsePrimitiveAttributeClonedInput } from './primitive'
import { parseSetAttributeClonedInput } from './set'
import { parseListAttributeClonedInput } from './list'
import { parseMapAttributeClonedInput } from './map'
import { parseRecordAttributeClonedInput } from './record'
import { parseAnyOfAttributeClonedInput } from './anyOf'

const defaultRequiringOptions = new Set<RequiredOption>(['atLeastOnce', 'always'])

export const parseAttributeClonedInput = <EXTENSION extends Extension>(
  attribute: Attribute,
  _input: AttributeValue<EXTENSION> | undefined,
  parsingOptions: ParsingOptions = {}
): AttributeParsedValue<EXTENSION> => {
  const { requiringOptions = defaultRequiringOptions } = parsingOptions

  /**
   * @debt extensions "Support extensions"
   */
  const input = _input as AttributeBasicValue<EXTENSION> | undefined

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
