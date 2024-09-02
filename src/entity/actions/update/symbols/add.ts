import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extension } from './isExtension.js'

export const $ADD = Symbol('$ADD')
export type $ADD = typeof $ADD

export type ADD<VALUE> = Extension<{ [$ADD]: VALUE }>

export const $add = <VALUE>(value: VALUE): ADD<VALUE> => ({ [$IS_EXTENSION]: true, [$ADD]: value })

export const isAddition = (input: unknown): input is { [$ADD]: unknown } =>
  isObject(input) && $ADD in input
