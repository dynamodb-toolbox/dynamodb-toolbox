import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { PrimitiveAttribute, ResolvedPrimitiveAttribute } from './types.js'

type InvalidEnumValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidEnumValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveAttribute['type']
    enumValue: ResolvedPrimitiveAttribute
  }
}>

type InvalidDefaultValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidDefaultValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveAttribute['type']
    defaultValue: unknown
  }
}>

type InvalidDefaultValueRangeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidDefaultValueRange'
  hasPath: true
  payload: {
    enumValues: NonNullable<PrimitiveAttribute['enum']>
    defaultValue: unknown
  }
}>

export type PrimitiveAttributeErrorBlueprints =
  | InvalidEnumValueTypeErrorBlueprint
  | InvalidDefaultValueTypeErrorBlueprint
  | InvalidDefaultValueRangeErrorBlueprint
