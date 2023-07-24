import type { Extension, ListAttribute, ResolvedAttribute } from 'v1/schema'
import { isArray } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions, ParsedListAttributeInput } from './types'

export const parseListAttributeClonedInput = <EXTENSION extends Extension>(
  listAttribute: ListAttribute,
  input: ResolvedAttribute<EXTENSION>,
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
     * @debt feature "add handleExtension in options"
     */
    // @ts-expect-error
    parsedInput.push(parseAttributeClonedInput(listAttribute.elements, element, parsingOptions))
  )

  return parsedInput
}
