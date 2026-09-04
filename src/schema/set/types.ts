import type { BinarySchema } from '../binary/index.js'
import type { BinarySchemaProps } from '../binary/types.js'
import type { NumberSchema } from '../number/index.js'
import type { NumberSchemaProps } from '../number/types.js'
import type { StringSchema } from '../string/index.js'
import type { StringSchemaProps } from '../string/types.js'
import type { AtLeastOnce } from '../types/index.js'

/**
 * Props enforced on a set's element schema.
 */
export interface SetElementProps {
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

/**
 * Schema allowed as a set element (number, string or binary).
 */
export type SetElementSchema =
  | NumberSchema<NumberSchemaProps & SetElementProps>
  | StringSchema<StringSchemaProps & SetElementProps>
  | BinarySchema<BinarySchemaProps & SetElementProps>
