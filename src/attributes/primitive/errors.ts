import type { ErrorBlueprint } from '~/errors/blueprint.js'

import type { BinarySchema } from '../binary/index.js'
import type { BooleanSchema } from '../boolean/index.js'
import type { NullSchema } from '../null/index.js'
import type { NumberSchema } from '../number/index.js'
import type { StringSchema } from '../string/index.js'
import type { PrimitiveSchema, ResolvedPrimitiveSchema } from './types.js'

type InvalidEnumValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitive.invalidEnumValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveSchema['type']
    enumValue: ResolvedPrimitiveSchema
  }
}>

type InvalidDefaultValueTypeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitive.invalidDefaultValueType'
  hasPath: true
  payload: {
    expectedType: PrimitiveSchema['type']
    defaultValue: unknown
  }
}>

type InvalidDefaultValueRangeErrorBlueprint = ErrorBlueprint<{
  code: 'schema.primitive.invalidDefaultValueRange'
  hasPath: true
  payload: {
    enumValues: NonNullable<
      (NullSchema | BooleanSchema | NumberSchema | StringSchema | BinarySchema)['props']['enum']
    >
    defaultValue: unknown
  }
}>

export type PrimitiveSchemaErrorBlueprint =
  | InvalidEnumValueTypeErrorBlueprint
  | InvalidDefaultValueTypeErrorBlueprint
  | InvalidDefaultValueRangeErrorBlueprint
