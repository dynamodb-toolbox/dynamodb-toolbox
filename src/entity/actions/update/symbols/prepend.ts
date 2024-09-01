import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extension } from './isExtension.js'

export const $PREPEND = Symbol('$PREPEND')
export type $PREPEND = typeof $PREPEND

export type PREPEND<VALUE> = Extension<{ [$PREPEND]: VALUE }>

export const $prepend = <VALUE>(value: VALUE): PREPEND<VALUE> => ({
  [$IS_EXTENSION]: true,
  [$PREPEND]: value
})

export const isPrepending = (input: unknown): input is { [$PREPEND]: unknown } =>
  isObject(input) && $PREPEND in input
