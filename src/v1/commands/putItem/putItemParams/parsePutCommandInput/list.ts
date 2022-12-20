import { ListAttribute, PossiblyUndefinedResolvedAttribute, PutItem } from 'v1'
import { isArray } from 'v1/utils/validation'

import { parseAttributePutCommandInput } from './attribute'

export const parseListAttributePutCommandInput = <LIST_ATTRIBUTE extends ListAttribute>(
  listAttribute: LIST_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): PutItem<LIST_ATTRIBUTE> => {
  if (!isArray(input)) {
    // TODO
    throw new Error()
  }

  const parsedPutItemInput: PossiblyUndefinedResolvedAttribute[] = []

  input.forEach(element =>
    parsedPutItemInput.push(parseAttributePutCommandInput(listAttribute.elements, element))
  )

  return parsedPutItemInput as PutItem<LIST_ATTRIBUTE>
}
