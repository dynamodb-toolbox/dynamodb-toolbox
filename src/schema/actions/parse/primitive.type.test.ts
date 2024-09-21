import type { A } from 'ts-toolbelt'

import type { PrimitiveAttribute, ResolvedPrimitiveAttribute } from '~/attributes/index.js'
import { string } from '~/attributes/string/index.js'
import { prefix } from '~/transformers/prefix.js'

import type { PrimitiveAttrParsedValue } from './primitive.js'

// Constraint
const assertConstraint: A.Equals<
  PrimitiveAttrParsedValue<PrimitiveAttribute>,
  ResolvedPrimitiveAttribute
> = 1
assertConstraint

// Simple
const simpleSchema = string().freeze()
const assertSimple: A.Equals<PrimitiveAttrParsedValue<typeof simpleSchema>, string> = 1
assertSimple

// Enum
const enumSchema = string().enum('foo', 'bar').freeze()
const assertEnum: A.Equals<PrimitiveAttrParsedValue<typeof enumSchema>, 'foo' | 'bar'> = 1
assertEnum

// Transformed
const transformedSchema = string().enum('foo', 'bar').transform(prefix('foo')).freeze()
const assertTransformed: A.Equals<PrimitiveAttrParsedValue<typeof transformedSchema>, string> = 1
assertTransformed
