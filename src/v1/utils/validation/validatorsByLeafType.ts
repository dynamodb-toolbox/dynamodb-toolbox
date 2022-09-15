import { LeafType } from 'v1/item/typers/leaf/types'

import { isBinary } from './isBinary'
import { isBoolean } from './isBoolean'
import { isNumber } from './isNumber'
import { isString } from './isString'

export const validatorsByLeafType: Record<LeafType, (value: unknown) => boolean> = {
  string: isString,
  number: isNumber,
  boolean: isBoolean,
  binary: isBinary
}
