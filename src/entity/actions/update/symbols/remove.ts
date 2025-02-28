import { isObject } from '~/utils/validation/isObject.js'

import type { Extended } from './isExtension.js'
import { $IS_EXTENSION } from './isExtension.js'

export const $REMOVE = Symbol('$REMOVE')
export type $REMOVE = typeof $REMOVE

export const $remove = (): REMOVE => ({ [$IS_EXTENSION]: true, [$REMOVE]: true })

export const isRemoval = (input: unknown): input is { [$REMOVE]: unknown } =>
  isObject(input) && $REMOVE in input

export type REMOVE = Extended<{ [$REMOVE]: true }>
