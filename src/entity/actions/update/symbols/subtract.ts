import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $SUBTRACT = Symbol('$SUBTRACT')
export type $SUBTRACT = typeof $SUBTRACT

export type SUBTRACT<A, B> = Extended<{ [$SUBTRACT]: [A, B] }>

export const $subtract = <A, B>(a: A, b: B): SUBTRACT<A, B> => ({
  [$IS_EXTENSION]: true,
  [$SUBTRACT]: [a, b]
})

export const isSubtraction = (input: unknown): input is { [$SUBTRACT]: unknown } =>
  isObject(input) && $SUBTRACT in input
