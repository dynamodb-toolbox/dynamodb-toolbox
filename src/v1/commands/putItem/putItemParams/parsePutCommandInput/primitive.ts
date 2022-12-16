import { PrimitiveAttribute } from 'v1'
import { validatorsByPrimitiveType } from 'v1/utils/validation'

import { PutCommandInputParser } from './types'

export const parsePrimitiveAttributePutCommandInput: PutCommandInputParser<PrimitiveAttribute> = (
  primitiveAttribute,
  putCommandInput
) => {
  let parsedPutItemInput: any = putCommandInput

  const validator = validatorsByPrimitiveType[primitiveAttribute.type]
  if (!validator(putCommandInput)) {
    // TODO
    throw new Error()
  }

  if (
    primitiveAttribute.enum !== undefined &&
    !primitiveAttribute.enum.includes(parsedPutItemInput)
  ) {
    // TODO
    throw new Error()
  }

  return parsedPutItemInput
}
