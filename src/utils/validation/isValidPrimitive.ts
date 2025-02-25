import type { PrimitiveAttribute, ResolvedPrimitiveAttribute } from '~/attributes/index.js'

import { isBigInt } from './isBigInt.js'
import { isBinary } from './isBinary.js'
import { isBoolean } from './isBoolean.js'
import { isNull } from './isNull.js'
import { isNumber } from './isNumber.js'
import { isString } from './isString.js'

export const isValidPrimitive = <ATTRIBUTE extends PrimitiveAttribute>(
  attribute: ATTRIBUTE,
  candidate: unknown
): candidate is ResolvedPrimitiveAttribute => {
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
