import type { Finder, SubSchema } from '~/schema/actions/finder/index.js'
import { isObject } from '~/utils/validation/isObject.js'
import { writable } from '~/utils/writable.js'

import type { ConditionType } from '../condition.js'

export const getComparedSubSchemas = (
  schemaFinder: Finder,
  comparedValue: string | number | bigint | boolean | Uint8Array | { attr: string }
): SubSchema[] | undefined =>
  isObject(comparedValue) && 'attr' in comparedValue
    ? schemaFinder.search(comparedValue.attr)
    : undefined

export const attributeType = writable([
  'S',
  'SS',
  'N',
  'NS',
  'B',
  'BS',
  'BOOL',
  'NULL',
  'L',
  'M'
] as const) satisfies ConditionType[]
