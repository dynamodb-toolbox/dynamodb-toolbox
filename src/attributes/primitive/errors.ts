import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { BinaryAttribute, ResolvedBinaryAttribute } from '../binary/index.js'
import type { BooleanAttribute, ResolvedBooleanAttribute } from '../boolean/index.js'
import type { NumberAttribute, ResolvedNumberAttribute } from '../number/index.js'
import type { ResolvedStringAttribute, StringAttribute } from '../string/index.js'
import type { PrimitiveAttribute } from './interface.js'
import type { PrimitiveAttributeType, ResolvePrimitiveAttributeType } from './types.js'

type InvalidEnumValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidEnumValueType'
  hasPath: true
  payload: {
    expectedType: (
      | PrimitiveAttribute
      | BooleanAttribute
      | NumberAttribute
      | StringAttribute
      | BinaryAttribute
    )['type']
    enumValue:
      | ResolvePrimitiveAttributeType<PrimitiveAttributeType>
      | ResolvedBooleanAttribute
      | ResolvedNumberAttribute
      | ResolvedStringAttribute
      | ResolvedBinaryAttribute
  }
}>

type InvalidDefaultValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidDefaultValueType'
  hasPath: true
  payload: {
    expectedType: (
      | PrimitiveAttribute
      | BooleanAttribute
      | NumberAttribute
      | StringAttribute
      | BinaryAttribute
    )['type']
    defaultValue: unknown
  }
}>

type InvalidDefaultValueRangeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidDefaultValueRange'
  hasPath: true
  payload: {
    enumValues: NonNullable<
      (
        | PrimitiveAttribute
        | BooleanAttribute
        | NumberAttribute
        | StringAttribute
        | BinaryAttribute
      )['enum']
    >
    defaultValue: unknown
  }
}>

export type PrimitiveAttributeErrorBlueprints =
  | InvalidEnumValueTypeErrorBlueprint
  | InvalidDefaultValueTypeErrorBlueprint
  | InvalidDefaultValueRangeErrorBlueprint
