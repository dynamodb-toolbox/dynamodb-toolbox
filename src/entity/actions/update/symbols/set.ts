import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $SET = Symbol('$SET')
export type $SET = typeof $SET

export const $set = <VALUE>(value: VALUE): SET<VALUE> => ({ [$IS_EXTENSION]: true, [$SET]: value })

export const isSetting = (input: unknown): input is { [$SET]: unknown } =>
  isObject(input) && $SET in input

export type SET<VALUE> = Extended<{ [$SET]: VALUE }>
