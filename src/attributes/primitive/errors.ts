import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { NumberAttribute, ResolvedNumberAttribute } from '../number/index.js'
import type { ResolvedStringAttribute, StringAttribute } from '../string/index.js'
import type { PrimitiveAttribute } from './interface.js'
import type { PrimitiveAttributeType, ResolvePrimitiveAttributeType } from './types.js'

type InvalidEnumValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidEnumValueType'
  hasPath: true
  payload: {
    expectedType: (PrimitiveAttribute | NumberAttribute | StringAttribute)['type']
    enumValue:
      | ResolvePrimitiveAttributeType<PrimitiveAttributeType>
      | ResolvedNumberAttribute
      | ResolvedStringAttribute
  }
}>

type InvalidDefaultValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidDefaultValueType'
  hasPath: true
  payload: {
    expectedType: (PrimitiveAttribute | NumberAttribute | StringAttribute)['type']
    defaultValue: unknown
  }
}>

type InvalidDefaultValueRangeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidDefaultValueRange'
  hasPath: true
  payload: {
    enumValues: NonNullable<(PrimitiveAttribute | NumberAttribute | StringAttribute)['enum']>
    defaultValue: unknown
  }
}>

export type PrimitiveAttributeErrorBlueprints =
  | InvalidEnumValueTypeErrorBlueprint
  | InvalidDefaultValueTypeErrorBlueprint
  | InvalidDefaultValueRangeErrorBlueprint
