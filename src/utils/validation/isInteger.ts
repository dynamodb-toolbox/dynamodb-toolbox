import { isNumber } from './isNumber.js'

/** Type guard checking that `candidate` is an integer number. */
export const isInteger = (candidate: unknown): candidate is number =>
  isNumber(candidate) && Number.isInteger(candidate)
