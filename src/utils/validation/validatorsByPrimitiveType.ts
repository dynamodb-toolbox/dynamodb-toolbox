import type { PrimitiveAttributeType } from '~/schema/attributes/primitive/types.js'

import { isBinary } from './isBinary.js'
import { isBoolean } from './isBoolean.js'
import { isNumber } from './isNumber.js'
import { isString } from './isString.js'

export const validatorsByPrimitiveType: Record<
  PrimitiveAttributeType,
  (value: unknown) => boolean
> = {
  string: isString,
  number: isNumber,
  boolean: isBoolean,
  binary: isBinary
}
