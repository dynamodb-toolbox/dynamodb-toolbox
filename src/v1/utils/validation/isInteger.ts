import { isNumber } from './isNumber.js'

export const isInteger = (candidate: unknown): candidate is number =>
  isNumber(candidate) && Number.isInteger(candidate)
