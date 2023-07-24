import type { SetAttribute, ResolvedAttribute, Extension } from 'v1/schema'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions, ParsedSetAttributeInput } from './types'

export const parseSetAttributeClonedInput = <EXTENSION extends Extension>(
  setAttribute: SetAttribute,
  input: ResolvedAttribute<EXTENSION>,
  parsingOptions: ParsingOptions = {}
): ParsedSetAttributeInput<EXTENSION> => {
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

  const parsedInput: ParsedSetAttributeInput<EXTENSION> = new Set()

  input.forEach(element =>
    /**
     * @debt feature "add handleExtension in options"
     */
    // @ts-expect-error
    parsedInput.add(parseAttributeClonedInput(setAttribute.elements, element, parsingOptions))
  )

  return parsedInput
}
