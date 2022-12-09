import { PrimitiveAttributeType } from 'v1/item/attributes/primitive/types'

import { isBinary } from './isBinary'
import { isBoolean } from './isBoolean'
import { isNumber } from './isNumber'
import { isString } from './isString'

export const validatorsByPrimitiveType: Record<
  PrimitiveAttributeType,
  (value: unknown) => boolean
> = {
  string: isString,
  number: isNumber,
  boolean: isBoolean,
  binary: isBinary
}
