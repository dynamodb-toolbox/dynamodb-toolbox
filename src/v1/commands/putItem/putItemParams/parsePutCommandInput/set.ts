import { SetAttribute } from 'v1'
import { isSet } from 'v1/utils/validation'

import { parseAttributePutCommandInput } from './attribute'
import { PutCommandInputParser } from './types'

export const parseSetAttributePutCommandInput: PutCommandInputParser<SetAttribute> = (
  setAttribute,
  putItemInput
) => {
  if (!isSet(putItemInput)) {
    // TODO
    throw new Error()
  }

  const parsedPutItemInput = new Set()

  putItemInput.forEach(element =>
    parsedPutItemInput.add(parseAttributePutCommandInput(setAttribute.elements, element))
  )

  return parsedPutItemInput as any
}
