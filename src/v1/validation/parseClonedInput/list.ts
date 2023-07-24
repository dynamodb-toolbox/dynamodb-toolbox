import type { AdditionalResolution, ListAttribute, ResolvedAttribute } from 'v1/schema'
import { isArray } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions, ParsedListAttributeInput } from './types'

export const parseListAttributeClonedInput = <ADDITIONAL_RESOLUTION extends AdditionalResolution>(
  listAttribute: ListAttribute,
  input: ResolvedAttribute<ADDITIONAL_RESOLUTION>,
  parsingOptions: ParsingOptions = {}
): ParsedListAttributeInput => {
  if (!isArray(input)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${listAttribute.path} should be a ${listAttribute.type}`,
      path: listAttribute.path,
      payload: {
        received: input,
        expected: listAttribute.type
      }
    })
  }

  const parsedInput: ParsedListAttributeInput = []

  input.forEach(element =>
    /**
     * @debt feature "add handleAdditionalResolution in options"
     */
    // @ts-expect-error
    parsedInput.push(parseAttributeClonedInput(listAttribute.elements, element, parsingOptions))
  )

  return parsedInput
}
