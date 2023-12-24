import { isString } from './isString'
import { isNumber } from './isNumber'
import { isBoolean } from './isBoolean'
import { isBinary } from './isBinary'

export const isPrimitive = (candidate: unknown): candidate is boolean | number | string | Buffer =>
  isString(candidate) || isNumber(candidate) || isBoolean(candidate) || isBinary(candidate)
