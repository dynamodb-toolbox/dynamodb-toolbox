import { isArray } from './isArray.js'
import { isBinary } from './isBinary.js'
import { isSet } from './isSet.js'

/** Type guard checking that `candidate` is a plain object (not an array, set or binary). */
export const isObject = (candidate: unknown): candidate is Record<string, unknown> =>
  typeof candidate === 'object' &&
  candidate !== null &&
  !isArray(candidate) &&
  !isSet(candidate) &&
  !isBinary(candidate)
