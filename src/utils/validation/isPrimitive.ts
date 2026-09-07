import { isBinary } from './isBinary.js'
import { isBoolean } from './isBoolean.js'
import { isNumber } from './isNumber.js'
import { isString } from './isString.js'

/** Type guard checking that `candidate` is a primitive (string, number, boolean or binary). */
export const isPrimitive = (
  candidate: unknown
): candidate is boolean | number | string | Uint8Array =>
  isString(candidate) || isNumber(candidate) || isBoolean(candidate) || isBinary(candidate)
