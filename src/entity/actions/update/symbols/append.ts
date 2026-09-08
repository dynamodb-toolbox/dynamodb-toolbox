import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $APPEND = Symbol('$APPEND')
/** Symbol key of the `$append` update extension. */
export type $APPEND = typeof $APPEND

/** Update extension appending elements to a list attribute. */
export type APPEND<VALUE> = Extended<{ [$APPEND]: VALUE }>

/** Append elements at the end of a list attribute. */
export const $append = <VALUE>(value: VALUE): APPEND<VALUE> => ({
  [$IS_EXTENSION]: true,
  [$APPEND]: value
})

/** Tell whether an update input is an `$append` extension. */
export const isAppending = (input: unknown): input is { [$APPEND]: unknown } =>
  isObject(input) && $APPEND in input
