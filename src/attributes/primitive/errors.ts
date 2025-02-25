import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { BinaryAttribute } from '../binary/index.js'
import type { BooleanAttribute } from '../boolean/index.js'
import type { NullAttribute } from '../null/index.js'
import type { NumberAttribute } from '../number/index.js'
import type { StringAttribute } from '../string/index.js'
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
    enumValues: NonNullable<
      (
        | NullAttribute
        | BooleanAttribute
        | NumberAttribute
        | StringAttribute
        | BinaryAttribute
      )['state']['enum']
    >
    defaultValue: unknown
  }
}>

export type PrimitiveAttributeErrorBlueprints =
  | InvalidEnumValueTypeErrorBlueprint
  | InvalidDefaultValueTypeErrorBlueprint
  | InvalidDefaultValueRangeErrorBlueprint
