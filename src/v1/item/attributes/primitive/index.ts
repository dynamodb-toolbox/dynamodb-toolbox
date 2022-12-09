export { string, boolean, binary, number } from './typer'
export type {
  PrimitiveAttributeType,
  ResolvePrimitiveAttributeType,
  ResolvedPrimitiveAttributeType
} from './types'
export type { _PrimitiveAttribute, PrimitiveAttribute, FreezePrimitiveAttribute } from './interface'
export {
  freezePrimitiveAttribute,
  InvalidEnumValueTypeError,
  InvalidDefaultValueTypeError,
  InvalidDefaultValueRangeError
} from './freeze'
