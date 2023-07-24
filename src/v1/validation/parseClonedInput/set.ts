import type { SetAttribute, ResolvedAttribute, AdditionalResolution } from 'v1/schema'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions, ParsedSetAttributeInput } from './types'

export const parseSetAttributeClonedInput = <ADDITIONAL_RESOLUTION extends AdditionalResolution>(
  setAttribute: SetAttribute,
  input: ResolvedAttribute<ADDITIONAL_RESOLUTION>,
  parsingOptions: ParsingOptions = {}
): ParsedSetAttributeInput<ADDITIONAL_RESOLUTION> => {
  if (!isSet(input)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${setAttribute.path} should be a ${setAttribute.type}`,
      path: setAttribute.path,
      payload: {
        received: input,
        expected: setAttribute.type
      }
    })
  }

  const parsedInput: ParsedSetAttributeInput<ADDITIONAL_RESOLUTION> = new Set()

  input.forEach(element =>
    /**
     * @debt feature "add handleAdditionalResolution in options"
     */
    // @ts-expect-error
    parsedInput.add(parseAttributeClonedInput(setAttribute.elements, element, parsingOptions))
  )

  return parsedInput
}
