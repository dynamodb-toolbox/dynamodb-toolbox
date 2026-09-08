import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $SET = Symbol('$SET')
/** Symbol key of the `$set` update extension. */
export type $SET = typeof $SET

/** Override an attribute with a complete value instead of updating it partially. */
export const $set = <VALUE>(value: VALUE): SET<VALUE> => ({ [$IS_EXTENSION]: true, [$SET]: value })

/** Tell whether an update input is a `$set` extension. */
export const isSetting = (input: unknown): input is { [$SET]: unknown } =>
  isObject(input) && $SET in input

/** Update extension overriding an attribute with a complete value. */
export type SET<VALUE> = Extended<{ [$SET]: VALUE }>
