import type { A } from 'ts-toolbelt'

import type {
  PrimitiveAttribute,
  ResolvedPrimitiveAttribute
} from '~/attributes/primitive/index.js'
import { string } from '~/attributes/string/index.js'
import { prefix } from '~/transformers/prefix.js'

import type { PrimitiveOrNumberAttrParsedValue } from './primitiveOrNumber.js'

// Constraint
const assertConstraint: A.Equals<
  PrimitiveOrNumberAttrParsedValue<PrimitiveAttribute>,
  ResolvedPrimitiveAttribute | null
> = 1
assertConstraint

// Simple
const simpleSchema = string().freeze()
const assertSimple: A.Equals<PrimitiveOrNumberAttrParsedValue<typeof simpleSchema>, string> = 1
assertSimple

// Enum
const enumSchema = string().enum('foo', 'bar').freeze()
const assertEnum: A.Equals<PrimitiveOrNumberAttrParsedValue<typeof enumSchema>, 'foo' | 'bar'> = 1
assertEnum

// Tranformed
const transformedSchema = string().enum('foo', 'bar').transform(prefix('foo')).freeze()
const assertTransformed: A.Equals<
  PrimitiveOrNumberAttrParsedValue<typeof transformedSchema>,
  string
> = 1
assertTransformed
