import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $PREPEND = Symbol('$PREPEND')
/** Symbol key of the `$prepend` update extension. */
export type $PREPEND = typeof $PREPEND

/** Update extension prepending elements to a list attribute. */
export type PREPEND<VALUE> = Extended<{ [$PREPEND]: VALUE }>

/** Prepend elements at the beginning of a list attribute. */
export const $prepend = <VALUE>(value: VALUE): PREPEND<VALUE> => ({
  [$IS_EXTENSION]: true,
  [$PREPEND]: value
})

/** Tell whether an update input is a `$prepend` extension. */
export const isPrepending = (input: unknown): input is { [$PREPEND]: unknown } =>
  isObject(input) && $PREPEND in input
