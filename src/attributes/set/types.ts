import type { BinaryAttribute, BinarySchema } from '../binary/index.js'
import type { BinaryAttributeState } from '../binary/types.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { NumberAttribute, NumberSchema } from '../number/index.js'
import type { NumberAttributeState } from '../number/types.js'
import type { StringAttribute, StringSchema } from '../string/index.js'
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

/**
 * @deprecated
 */
export type SetAttributeElements =
  | NumberAttribute<NumberAttributeState & SetElementState>
  | StringAttribute<StringAttributeState & SetElementState>
  | BinaryAttribute<BinaryAttributeState & SetElementState>
