import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $ADD = Symbol('$ADD')
/** Symbol key of the `$add` update extension. */
export type $ADD = typeof $ADD

/** Update extension adding a value to a number attribute, or elements to a set attribute. */
export type ADD<VALUE> = Extended<{ [$ADD]: VALUE }>

/** Add a value to a number attribute, or elements to a set attribute. */
export const $add = <VALUE>(value: VALUE): ADD<VALUE> => ({ [$IS_EXTENSION]: true, [$ADD]: value })

/** Tell whether an update input is an `$add` extension. */
export const isAddition = (input: unknown): input is { [$ADD]: unknown } =>
  isObject(input) && $ADD in input
