import type { Schema, SchemaExtendedValue } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { Reference } from '../types.js'
import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $GET = Symbol('$GET')
export type $GET = typeof $GET

export type GET<VALUE> = Extended<{ [$GET]: VALUE }>

export const $get = <
  REFERENCE extends string,
  FALLBACK extends undefined | SchemaExtendedValue | Reference<Schema, string> = undefined
>(
  reference: REFERENCE,
  fallback?: FALLBACK
): GET<FALLBACK extends undefined ? [REFERENCE] : [REFERENCE, FALLBACK]> => ({
  [$IS_EXTENSION]: true,
  [$GET]: (fallback === undefined ? [reference] : [reference, fallback]) as any
})

export const isGetting = (input: unknown): input is { [$GET]: unknown } =>
  isObject(input) && $GET in input
