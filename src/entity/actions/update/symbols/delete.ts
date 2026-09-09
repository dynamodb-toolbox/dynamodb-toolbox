import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $DELETE = Symbol('$DELETE')
/** Symbol key of the `$delete` update extension. */
export type $DELETE = typeof $DELETE

/** Update extension removing elements from a set attribute. */
export type DELETE<VALUE> = Extended<{ [$DELETE]: VALUE }>

/** Remove elements from a set attribute. */
export const $delete = <VALUE>(value: VALUE): DELETE<VALUE> => ({
  [$IS_EXTENSION]: true,
  [$DELETE]: value
})

/** Tell whether an update input is a `$delete` extension. */
export const isDeletion = (input: unknown): input is { [$DELETE]: unknown } =>
  isObject(input) && $DELETE in input
