import type { Extension, ListAttribute, AttributeBasicValue, Transformer } from 'v1/schema'
import { $type, $transform } from 'v1/schema/attributes/constants/attributeOptions'
import { isPrimitiveAttribute } from 'v1/schema/utils/isPrimitiveAttribute'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ListAttributeParsedBasicValue } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'

export const parseListAttributeClonedInput = <EXTENSION extends Extension>(
  listAttribute: ListAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): ListAttributeParsedBasicValue<EXTENSION> => {
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

  const parsedInput: ListAttributeParsedBasicValue<EXTENSION> = []
  parsedInput[$type] = 'list'

  input.forEach(element =>
    parsedInput.push(parseAttributeClonedInput(listAttribute.elements, element, parsingOptions))
  )

  if (
    isPrimitiveAttribute(listAttribute.elements) &&
    listAttribute.elements.transform !== undefined
  ) {
    parsedInput[$transform] = listAttribute.elements.transform as Transformer
  }

  return parsedInput
}
