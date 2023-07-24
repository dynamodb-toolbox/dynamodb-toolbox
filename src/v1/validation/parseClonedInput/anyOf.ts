import type { AnyOfAttribute, ResolvedAttribute, AdditionalResolution } from 'v1/schema'
import type { AnyOfAttributeClonedInputsWithDefaults } from 'v1/validation/cloneInputAndAddDefaults/types'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions, ParsedAttributeInput } from './types'

export const parseAnyOfAttributeClonedInput = <ADDITIONAL_RESOLUTION extends AdditionalResolution>(
  anyOfAttribute: AnyOfAttribute,
  input: ResolvedAttribute<ADDITIONAL_RESOLUTION>,
  parsingOptions: ParsingOptions = {}
): ParsedAttributeInput<ADDITIONAL_RESOLUTION> => {
  let parsedInput: ParsedAttributeInput<ADDITIONAL_RESOLUTION> | undefined = undefined

  const {
    originalInput,
    clonedInputsWithDefaults
  } = input as AnyOfAttributeClonedInputsWithDefaults<ADDITIONAL_RESOLUTION>

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
