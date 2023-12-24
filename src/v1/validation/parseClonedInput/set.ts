import type { SetAttribute, AttributeBasicValue, Extension, Transformer } from 'v1/schema'
import { $type, $transform } from 'v1/schema/attributes/constants/attributeOptions'
import { isSet } from 'v1/utils/validation/isSet'
import { DynamoDBToolboxError } from 'v1/errors'

import type { SetAttributeParsedBasicValue } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'

export const parseSetAttributeClonedInput = <EXTENSION extends Extension>(
  setAttribute: SetAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): SetAttributeParsedBasicValue<EXTENSION> => {
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

  const parsedInput: SetAttributeParsedBasicValue<EXTENSION> = new Set()
  parsedInput[$type] = 'set'

  input.forEach(element =>
    parsedInput.add(parseAttributeClonedInput(setAttribute.elements, element, parsingOptions))
  )

  if (setAttribute.elements.transform) {
    parsedInput[$transform] = setAttribute.elements.transform as Transformer
  }

  return parsedInput
}
