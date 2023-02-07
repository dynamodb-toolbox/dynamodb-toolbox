import type { ErrorBlueprint } from 'v1/errors/blueprint'

import type {
  PrimitiveAttributeType,
  ResolvePrimitiveAttributeType,
  PrimitiveAttributeDefaultValue,
  PrimitiveAttributeEnumValues
} from './types'

export type InvalidPrimitiveAttributeEnumValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'invalidPrimitiveAttributeEnumValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveAttributeType
    enumValue: ResolvePrimitiveAttributeType<PrimitiveAttributeType>
  }
}>

export type InvalidPrimitiveAttributeDefaultValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'invalidPrimitiveAttributeDefaultValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveAttributeType
    defaultValue: NonNullable<PrimitiveAttributeDefaultValue<PrimitiveAttributeType>>
  }
}>

export type InvalidPrimitiveAttributeDefaultValueRangeErrorBlueprint = ErrorBlueprint<{
  code: 'invalidPrimitiveAttributeDefaultValueRange'
  hasPath: true
  payload: {
    enumValues: NonNullable<PrimitiveAttributeEnumValues<PrimitiveAttributeType>>
    defaultValue: NonNullable<PrimitiveAttributeDefaultValue<PrimitiveAttributeType>>
  }
}>
