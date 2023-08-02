import { isNumber } from './isNumber'

export const isInteger = (candidate: unknown): candidate is number =>
  isNumber(candidate) && Number.isInteger(candidate)
