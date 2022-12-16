import { ListAttribute } from 'v1'
import { isArray, isSet } from 'v1/utils/validation'

import { parseAttributePutCommandInput } from './attribute'
import { PutCommandInputParser } from './types'

export const parseListAttributePutCommandInput: PutCommandInputParser<ListAttribute> = (
  listAttribute,
  putItemInput
) => {
  if (!isArray(putItemInput)) {
    // TODO
    throw new Error()
  }

  const parsedPutItemInput: any[] = []

  putItemInput.forEach(element =>
    parsedPutItemInput.push(parseAttributePutCommandInput(listAttribute.elements, element))
  )

  return parsedPutItemInput as any
}
