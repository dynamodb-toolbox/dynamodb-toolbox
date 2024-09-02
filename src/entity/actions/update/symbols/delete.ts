import { isObject } from '~/utils/validation/isObject.js'

import { $IS_EXTENSION } from './isExtension.js'
import type { Extension } from './isExtension.js'

export const $DELETE = Symbol('$DELETE')
export type $DELETE = typeof $DELETE

export type DELETE<VALUE> = Extension<{ [$DELETE]: VALUE }>

export const $delete = <VALUE>(value: VALUE): DELETE<VALUE> => ({
  [$IS_EXTENSION]: true,
  [$DELETE]: value
})

export const isDeletion = (input: unknown): input is { [$DELETE]: unknown } =>
  isObject(input) && $DELETE in input
