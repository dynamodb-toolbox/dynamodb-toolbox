import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $SUBTRACT = Symbol('$SUBTRACT')
/** Symbol key of the `$subtract` update extension. */
export type $SUBTRACT = typeof $SUBTRACT

/** Update extension setting a number attribute to the difference of two operands. */
export type SUBTRACT<A, B> = Extended<{ [$SUBTRACT]: [A, B] }>

/** Set a number attribute to the difference of two operands. */
export const $subtract = <A, B>(a: A, b: B): SUBTRACT<A, B> => ({
  [$IS_EXTENSION]: true,
  [$SUBTRACT]: [a, b]
})

/** Tell whether an update input is a `$subtract` extension. */
export const isSubtraction = (input: unknown): input is { [$SUBTRACT]: unknown } =>
  isObject(input) && $SUBTRACT in input
