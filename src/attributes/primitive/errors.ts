import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { BinaryAttribute, ResolvedBinaryAttribute } from '../binary/index.js'
import type { BooleanAttribute, ResolvedBooleanAttribute } from '../boolean/index.js'
import type { NullAttribute, ResolvedNullAttribute } from '../null/index.js'
import type { NumberAttribute, ResolvedNumberAttribute } from '../number/index.js'
import type { ResolvedStringAttribute, StringAttribute } from '../string/index.js'

type InvalidEnumValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidEnumValueType'
  hasPath: true
  payload: {
    expectedType: (
      | NullAttribute
      | BooleanAttribute
      | NumberAttribute
      | StringAttribute
      | BinaryAttribute
    )['type']
    enumValue:
      | ResolvedNullAttribute
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
      | NullAttribute
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
        | NullAttribute
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
