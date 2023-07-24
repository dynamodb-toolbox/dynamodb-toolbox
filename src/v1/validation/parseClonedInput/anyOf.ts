import type { AnyOfAttribute, AttributeBasicValue, Extension } from 'v1/schema'
import type { AnyOfAttributeClonedInputsWithDefaults } from 'v1/validation/cloneInputAndAddDefaults/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsingOptions, AttributeParsedValue } from './types'
import { parseAttributeClonedInput } from './attribute'

export const parseAnyOfAttributeClonedInput = <EXTENSION extends Extension>(
  anyOfAttribute: AnyOfAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions = {}
): AttributeParsedValue<EXTENSION> => {
  let parsedInput: AttributeParsedValue<EXTENSION> | undefined = undefined

  const {
    originalInput,
    clonedInputsWithDefaults
  } = input as AnyOfAttributeClonedInputsWithDefaults<EXTENSION>

  let subSchemaIndex = 0
  while (parsedInput === undefined && subSchemaIndex < anyOfAttribute.elements.length) {
    try {
      const element = anyOfAttribute.elements[subSchemaIndex]
      const input = clonedInputsWithDefaults[subSchemaIndex]
      parsedInput = parseAttributeClonedInput(element, input, parsingOptions)
      break
    } catch (error) {
      subSchemaIndex += 1
      continue
    }
  }

  if (parsedInput === undefined) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${anyOfAttribute.path} does not match any of the possible sub-types`,
      path: anyOfAttribute.path,
      payload: {
        received: originalInput
      }
    })
  }

  return parsedInput
}
