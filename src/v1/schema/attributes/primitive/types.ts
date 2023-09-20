import type { ComputedDefault } from '../constants/computedDefault'
import type { ExtendedValue, Extension } from '../types'

/**
 * Possible Primitive Attribute type
 */
export type PrimitiveAttributeType = 'string' | 'boolean' | 'number' | 'binary'

/**
 * Returns the corresponding TS type of a Primitive Attribute type
 *
 * @param T Primitive Type
 */
export type ResolvePrimitiveAttributeType<
  TYPE extends PrimitiveAttributeType
> = TYPE extends 'string'
  ? string
  : TYPE extends 'number'
  ? number
  : TYPE extends 'boolean'
  ? boolean
  : TYPE extends 'binary'
  ? Buffer
  : never

/**
 * TS type of any Primitive Attribute
 */
export type ResolvedPrimitiveAttribute = ResolvePrimitiveAttributeType<PrimitiveAttributeType>

/**
 * Primitive Enum values constraint
 */
export type PrimitiveAttributeEnumValues<TYPE extends PrimitiveAttributeType> =
  | ResolvePrimitiveAttributeType<TYPE>[]
  | undefined

type ValueOrGetter<VALUE> = VALUE | (() => VALUE)

/**
 * Primitive Default values constraint
 */
export type PrimitiveAttributeDefaultValue<
  TYPES extends PrimitiveAttributeType,
  ENUM extends PrimitiveAttributeEnumValues<TYPES> = PrimitiveAttributeEnumValues<TYPES>,
  EXTENSION extends Extension = never
> =
  | undefined
  | ComputedDefault
  | (ENUM extends ResolvePrimitiveAttributeType<TYPES>[]
      ? ValueOrGetter<ENUM[number]>
      : ValueOrGetter<ResolvePrimitiveAttributeType<TYPES>>)
  | (() => TYPES extends infer TYPE
      ? TYPE extends PrimitiveAttributeType
        ? ExtendedValue<EXTENSION, TYPE>
        : never
      : never)
