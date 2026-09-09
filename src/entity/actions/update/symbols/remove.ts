import { isObject } from '~/utils/validation/isObject.js'

import type { Extended } from './isExtension.js'
import { $IS_EXTENSION } from './isExtension.js'

export const $REMOVE = Symbol('$REMOVE')
/** Symbol key of the `$remove` update extension. */
export type $REMOVE = typeof $REMOVE

/** Remove an attribute from an item. */
export const $remove = (): REMOVE => ({ [$IS_EXTENSION]: true, [$REMOVE]: true })

/** Tell whether an update input is a `$remove` extension. */
export const isRemoval = (input: unknown): input is { [$REMOVE]: unknown } =>
  isObject(input) && $REMOVE in input

/** Update extension removing an attribute from an item. */
export type REMOVE = Extended<{ [$REMOVE]: true }>
