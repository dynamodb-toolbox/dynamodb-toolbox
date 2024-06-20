import { isString } from './isString.js'
import { isNumber } from './isNumber.js'
import { isBoolean } from './isBoolean.js'
import { isBinary } from './isBinary.js'

export const isPrimitive = (candidate: unknown): candidate is boolean | number | string | Buffer =>
  isString(candidate) || isNumber(candidate) || isBoolean(candidate) || isBinary(candidate)
