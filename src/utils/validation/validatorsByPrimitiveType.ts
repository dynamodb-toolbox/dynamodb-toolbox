import { isBinary } from './isBinary.js'
import { isBoolean } from './isBoolean.js'
import { isNull } from './isNull.js'
import { isNumber } from './isNumber.js'
import { isString } from './isString.js'

export const validatorsByPrimitiveType = {
  null: isNull,
  boolean: isBoolean,
  number: isNumber,
  string: isString,
  binary: isBinary
}
