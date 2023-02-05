export { string, boolean, binary, number } from './typer'
export type {
  PrimitiveAttributeType,
  ResolvePrimitiveAttributeType,
  ResolvedPrimitiveAttribute
} from './types'
export type { $PrimitiveAttribute, PrimitiveAttribute } from './interface'
export {
  FreezePrimitiveAttribute,
  freezePrimitiveAttribute,
  InvalidEnumValueTypeError,
  InvalidDefaultValueTypeError,
  InvalidDefaultValueRangeError
} from './freeze'
export type { $ResolvePrimitiveAttribute, ResolvePrimitiveAttribute } from './resolve'
