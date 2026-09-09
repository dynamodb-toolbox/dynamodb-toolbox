import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $SUM = Symbol('$SUM')
/** Symbol key of the `$sum` update extension. */
export type $SUM = typeof $SUM

/** Update extension setting a number attribute to the sum of two operands. */
export type SUM<A, B> = Extended<{ [$SUM]: [A, B] }>

/** Set a number attribute to the sum of two operands. */
export const $sum = <A, B>(a: A, b: B): SUM<A, B> => ({ [$IS_EXTENSION]: true, [$SUM]: [a, b] })

/** Tell whether an update input is a `$sum` extension. */
export const isSum = (input: unknown): input is { [$SUM]: unknown } =>
  isObject(input) && $SUM in input
