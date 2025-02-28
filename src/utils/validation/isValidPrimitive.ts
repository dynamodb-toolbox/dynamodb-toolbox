import type { PrimitiveSchema, ResolvedPrimitiveSchema } from '~/attributes/index.js'

import { isBigInt } from './isBigInt.js'
import { isBinary } from './isBinary.js'
import { isBoolean } from './isBoolean.js'
import { isNull } from './isNull.js'
import { isNumber } from './isNumber.js'
import { isString } from './isString.js'

export const isValidPrimitive = <SCHEMA extends PrimitiveSchema>(
  schema: SCHEMA,
  candidate: unknown
): candidate is ResolvedPrimitiveSchema => {
  switch (schema.type) {
    case 'null':
      return isNull(candidate)
    case 'boolean':
      return isBoolean(candidate)
    case 'number':
      return isNumber(candidate) || Boolean(schema.props.big && isBigInt(candidate))
    case 'string':
      return isString(candidate)
    case 'binary':
      return isBinary(candidate)
  }
}
