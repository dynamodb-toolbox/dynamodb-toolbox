import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { BinarySchema } from '../binary/index.js'
import type { BooleanSchema } from '../boolean/index.js'
import type { NullSchema } from '../null/index.js'
import type { NumberSchema } from '../number/index.js'
import type { StringSchema } from '../string/index.js'
import type { PrimitiveSchema, ResolvedPrimitiveSchema } from './types.js'

type InvalidEnumValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidEnumValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveSchema['type']
    enumValue: ResolvedPrimitiveSchema
  }
}>

type InvalidDefaultValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidDefaultValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveSchema['type']
    defaultValue: unknown
  }
}>

type InvalidDefaultValueRangeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitiveAttribute.invalidDefaultValueRange'
  hasPath: true
  payload: {
    enumValues: NonNullable<
      (NullSchema | BooleanSchema | NumberSchema | StringSchema | BinarySchema)['state']['enum']
    >
    defaultValue: unknown
  }
}>

export type PrimitiveAttributeErrorBlueprints =
  | InvalidEnumValueTypeErrorBlueprint
  | InvalidDefaultValueTypeErrorBlueprint
  | InvalidDefaultValueRangeErrorBlueprint
