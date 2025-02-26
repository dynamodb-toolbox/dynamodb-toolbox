import type { PrimitiveSchema, ResolvedPrimitiveSchema } from '~/attributes/index.js'

import { isBigInt } from './isBigInt.js'
import { isBinary } from './isBinary.js'
import { isBoolean } from './isBoolean.js'
import { isNull } from './isNull.js'
import { isNumber } from './isNumber.js'
import { isString } from './isString.js'

export const isValidPrimitive = <ATTRIBUTE extends PrimitiveSchema>(
  attribute: ATTRIBUTE,
  candidate: unknown
): candidate is ResolvedPrimitiveSchema => {
  switch (attribute.type) {
    case 'null':
      return isNull(candidate)
    case 'boolean':
      return isBoolean(candidate)
    case 'number':
      return isNumber(candidate) || Boolean(attribute.state.big && isBigInt(candidate))
    case 'string':
      return isString(candidate)
    case 'binary':
      return isBinary(candidate)
  }
}
