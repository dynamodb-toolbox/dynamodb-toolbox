import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $APPEND = Symbol('$APPEND')
export type $APPEND = typeof $APPEND

export type APPEND<VALUE> = Extended<{ [$APPEND]: VALUE }>

export const $append = <VALUE>(value: VALUE): APPEND<VALUE> => ({
  [$IS_EXTENSION]: true,
  [$APPEND]: value
})

export const isAppending = (input: unknown): input is { [$APPEND]: unknown } =>
  isObject(input) && $APPEND in input
