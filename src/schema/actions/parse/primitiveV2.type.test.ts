import type { A } from 'ts-toolbelt'

import type {
  BinaryAttribute,
  BooleanAttribute,
  NullAttribute,
  NumberAttribute,
  ResolvedBinaryAttribute,
  ResolvedBooleanAttribute,
  ResolvedNullAttribute,
  ResolvedNumberAttribute,
  ResolvedStringAttribute,
  StringAttribute
} from '~/attributes/index.js'
import { string } from '~/attributes/string/index.js'
import { prefix } from '~/transformers/prefix.js'

import type { PrimitiveAttrV2ParsedValue } from './primitiveV2.js'

// Constraint
const assertConstraint: A.Equals<
  PrimitiveAttrV2ParsedValue<
    NullAttribute | BooleanAttribute | NumberAttribute | StringAttribute | BinaryAttribute
  >,
  | ResolvedBinaryAttribute
  | ResolvedBooleanAttribute
  | ResolvedNullAttribute
  | ResolvedNumberAttribute
  | ResolvedStringAttribute
> = 1
assertConstraint

// Simple
const simpleSchema = string().freeze()
const assertSimple: A.Equals<PrimitiveAttrV2ParsedValue<typeof simpleSchema>, string> = 1
assertSimple

// Enum
const enumSchema = string().enum('foo', 'bar').freeze()
const assertEnum: A.Equals<PrimitiveAttrV2ParsedValue<typeof enumSchema>, 'foo' | 'bar'> = 1
assertEnum

// Tranformed
const transformedSchema = string().enum('foo', 'bar').transform(prefix('foo')).freeze()
const assertTransformed: A.Equals<PrimitiveAttrV2ParsedValue<typeof transformedSchema>, string> = 1
assertTransformed
