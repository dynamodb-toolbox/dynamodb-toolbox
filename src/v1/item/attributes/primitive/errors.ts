import type { ErrorBlueprint } from 'v1/errors/blueprint'

import type {
  PrimitiveAttributeType,
  ResolvePrimitiveAttributeType,
  PrimitiveAttributeDefaultValue,
  PrimitiveAttributeEnumValues
} from './types'

type InvalidEnumValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'item.primitiveAttribute.invalidEnumValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveAttributeType
    enumValue: ResolvePrimitiveAttributeType<PrimitiveAttributeType>
  }
}>

type InvalidDefaultValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'item.primitiveAttribute.invalidDefaultValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveAttributeType
    defaultValue: NonNullable<PrimitiveAttributeDefaultValue<PrimitiveAttributeType>>
  }
}>

type InvalidDefaultValueRangeErrorBlueprint = ErrorBlueprint<{
  code: 'item.primitiveAttribute.invalidDefaultValueRange'
  hasPath: true
  payload: {
    enumValues: NonNullable<PrimitiveAttributeEnumValues<PrimitiveAttributeType>>
    defaultValue: NonNullable<PrimitiveAttributeDefaultValue<PrimitiveAttributeType>>
  }
}>

export type PrimitiveAttributeErrorBlueprints =
  | InvalidEnumValueTypeErrorBlueprint
  | InvalidDefaultValueTypeErrorBlueprint
  | InvalidDefaultValueRangeErrorBlueprint
