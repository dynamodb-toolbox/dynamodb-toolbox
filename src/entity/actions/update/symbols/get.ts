import type { Schema, SchemaExtendedValue } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { Reference } from '../types.js'
import { $IS_EXTENSION } from './isExtension.js'
import type { Extended } from './isExtension.js'

export const $GET = Symbol('$GET')
/** Symbol key of the `$get` update extension. */
export type $GET = typeof $GET

/** Update extension referencing the value of another attribute. */
export type GET<VALUE> = Extended<{ [$GET]: VALUE }>

/** Reference the value of another attribute, with an optional fallback. */
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

/** Tell whether an update input is a `$get` extension. */
export const isGetting = (input: unknown): input is { [$GET]: unknown } =>
  isObject(input) && $GET in input
