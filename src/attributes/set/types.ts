import type { BinarySchema } from '../binary/index.js'
import type { BinaryAttributeState } from '../binary/types.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { NumberSchema } from '../number/index.js'
import type { NumberAttributeState } from '../number/types.js'
import type { StringSchema } from '../string/index.js'
import type { StringAttributeState } from '../string/types.js'

interface SetElementState {
  required?: AtLeastOnce
  hidden?: false
  key?: boolean
  savedAs?: undefined
  keyDefault?: undefined
  putDefault?: undefined
  updateDefault?: undefined
  keyLink?: undefined
  putLink?: undefined
  updateLink?: undefined
}

export type SetElementSchema =
  | NumberSchema<NumberAttributeState & SetElementState>
  | StringSchema<StringAttributeState & SetElementState>
  | BinarySchema<BinaryAttributeState & SetElementState>
