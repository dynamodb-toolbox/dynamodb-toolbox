import { ListAttribute, PossiblyUndefinedResolvedAttribute, KeyInput } from 'v1'
import { isArray } from 'v1/utils/validation'

import { parseAttributeKeyInput } from './attribute'

export const parseListAttributeKeyInput = <LIST_ATTRIBUTE extends ListAttribute>(
  listAttribute: LIST_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): KeyInput<LIST_ATTRIBUTE> => {
  if (!isArray(input)) {
    // TODO
    throw new Error()
  }

  const parsedKeyInput: PossiblyUndefinedResolvedAttribute[] = []

  input.forEach(element =>
    parsedKeyInput.push(parseAttributeKeyInput(listAttribute.elements, element))
  )

  return parsedKeyInput as KeyInput<LIST_ATTRIBUTE>
}
