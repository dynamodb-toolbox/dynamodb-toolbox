import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { NumberAttribute, ResolvedNumberAttribute } from '../number/index.js'
import type { PrimitiveAttribute } from './interface.js'
import type { PrimitiveAttributeType, ResolvePrimitiveAttributeType } from './types.js'

type InvalidEnumValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidEnumValueType'
  hasPath: true
  payload: {
    expectedType: (PrimitiveAttribute | NumberAttribute)['type']
    enumValue: ResolvePrimitiveAttributeType<PrimitiveAttributeType> | ResolvedNumberAttribute
  }
}>

type InvalidDefaultValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidDefaultValueType'
  hasPath: true
  payload: {
    expectedType: (PrimitiveAttribute | NumberAttribute)['type']
    defaultValue: unknown
  }
}>

type InvalidDefaultValueRangeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidDefaultValueRange'
  hasPath: true
  payload: {
    enumValues: NonNullable<PrimitiveAttribute['enum'] | NumberAttribute['enum']>
    defaultValue: unknown
  }
}>

export type PrimitiveAttributeErrorBlueprints =
  | InvalidEnumValueTypeErrorBlueprint
  | InvalidDefaultValueTypeErrorBlueprint
  | InvalidDefaultValueRangeErrorBlueprint
