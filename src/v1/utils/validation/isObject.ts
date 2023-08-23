import { isArray } from './isArray'
import { isSet } from './isSet'

export const isObject = (candidate: unknown): candidate is Record<string, unknown> =>
  typeof candidate === 'object' && candidate !== null && !isArray(candidate) && !isSet(candidate)
