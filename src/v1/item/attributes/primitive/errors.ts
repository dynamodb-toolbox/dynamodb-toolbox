import type { ErrorBlueprint } from 'v1/errors/blueprint'

import type {
  PrimitiveAttributeType,
  ResolvePrimitiveAttributeType,
  PrimitiveAttributeDefaultValue,
  PrimitiveAttributeEnumValues
} from './types'

export type InvalidEnumValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'invalidEnumValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveAttributeType
    enumValue: ResolvePrimitiveAttributeType<PrimitiveAttributeType>
  }
}>

export type InvalidDefaultValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'invalidDefaultValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveAttributeType
    defaultValue: NonNullable<PrimitiveAttributeDefaultValue<PrimitiveAttributeType>>
  }
}>

export type InvalidDefaultValueRangeErrorBlueprint = ErrorBlueprint<{
  code: 'invalidDefaultValueRange'
  hasPath: true
  payload: {
    enumValues: NonNullable<PrimitiveAttributeEnumValues<PrimitiveAttributeType>>
    defaultValue: NonNullable<PrimitiveAttributeDefaultValue<PrimitiveAttributeType>>
  }
}>
