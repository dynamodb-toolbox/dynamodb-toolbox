import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $SUM = Symbol('$SUM')
export type $SUM = typeof $SUM

export type SUM<A, B> = Extended<{ [$SUM]: [A, B] }>

export const $sum = <A, B>(a: A, b: B): SUM<A, B> => ({ [$IS_EXTENSION]: true, [$SUM]: [a, b] })

export const isSum = (input: unknown): input is { [$SUM]: unknown } =>
  isObject(input) && $SUM in input
