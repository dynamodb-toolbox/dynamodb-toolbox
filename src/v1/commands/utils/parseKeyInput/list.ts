import type { ListAttribute, PossiblyUndefinedResolvedAttribute, AttributeKeyInput } from 'v1'
import { isArray } from 'v1/utils/validation'

import { parseAttributeKeyInput } from './attribute'

export const parseListAttributeKeyInput = <LIST_ATTRIBUTE extends ListAttribute>(
  listAttribute: LIST_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): AttributeKeyInput<LIST_ATTRIBUTE> => {
  if (!isArray(input)) {
    // TODO
    throw new Error()
  }

  const parsedKeyInput: PossiblyUndefinedResolvedAttribute[] = []

  input.forEach(element =>
    parsedKeyInput.push(parseAttributeKeyInput(listAttribute.elements, element))
  )

  return parsedKeyInput as AttributeKeyInput<LIST_ATTRIBUTE>
}
