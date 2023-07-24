import type { RequiredOption, Attribute, AttributeValue, Extension } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'

import { parsePrimitiveAttributeClonedInput } from './primitive'
import { parseSetAttributeClonedInput } from './set'
import { parseListAttributeClonedInput } from './list'
import { parseMapAttributeClonedInput } from './map'
import { parseRecordAttributeClonedInput } from './record'
import { parseAnyOfAttributeClonedInput } from './anyOf'
import type { ParsingOptions, ParsedAttributeInput } from './types'

const defaultRequiringOptions = new Set<RequiredOption>(['atLeastOnce', 'always'])

export const parseAttributeClonedInput = <EXTENSION extends Extension>(
  attribute: Attribute,
  input: AttributeValue<EXTENSION>,
  parsingOptions: ParsingOptions = {}
): ParsedAttributeInput<EXTENSION> => {
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

// if (input === $remove) {
//   if (commandName !== 'update') {
//     // TODO
//     throw new Error()
//   }

//   if (attribute.required === 'never') {
//     throw new DynamoDBToolboxError('parsing.attributeRequired', {
//       message: `Attribute ${attribute.path} cannot be removed`,
//       path: attribute.path
//     })
//   } else {
//     return $remove
//   }
// }

// if (isAddOperation(input)) {
//   if (commandName !== 'update') {
//     // TODO
//     throw new Error()
//   }

//   return { [$add]: parseAttributeClonedInput(attribute, input[$add], parsingOptions) }
// }

// if (isDeleteOperation(input)) {
//   if (commandName !== 'update') {
//     // TODO
//     throw new Error()
//   }

//   return { [$delete]: parseAttributeClonedInput(attribute, input[$delete], parsingOptions) }
// }
