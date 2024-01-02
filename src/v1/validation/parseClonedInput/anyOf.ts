import type { AnyOfAttribute, AttributeBasicValue, Extension, AttributeValue } from 'v1/schema'
import type { AnyOfAttributeClonedInputsWithDefaults } from 'v1/validation/cloneInputAndAddDefaults/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'

export function* parseAnyOfAttributeClonedInput<EXTENSION extends Extension>(
  anyOfAttribute: AnyOfAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): Generator<AttributeValue<EXTENSION>, AttributeValue<EXTENSION>> {
  let parsedInput: AttributeValue<EXTENSION> | undefined = undefined
  let parser: Generator<AttributeValue<EXTENSION>> | undefined = undefined

  const {
    originalInput,
    clonedInputsWithDefaults
  } = input as AnyOfAttributeClonedInputsWithDefaults<EXTENSION>

  let subSchemaIndex = 0
  while (parsedInput === undefined && subSchemaIndex < anyOfAttribute.elements.length) {
    try {
      const element = anyOfAttribute.elements[subSchemaIndex]
      const input = clonedInputsWithDefaults[subSchemaIndex]
      parser = parseAttributeClonedInput(element, input, parsingOptions)
      parsedInput = parser.next().value
      break
    } catch (error) {
      subSchemaIndex += 1
      continue
    }
  }

  if (parser === undefined || parsedInput === undefined) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${anyOfAttribute.path} does not match any of the possible sub-types`,
      path: anyOfAttribute.path,
      payload: {
        received: originalInput
      }
    })
  }

  yield parsedInput

  return parser.next().value
}
