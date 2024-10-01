import type { A } from 'ts-toolbelt'

import type { PrimitiveAttribute, ResolvedPrimitiveAttribute } from '~/attributes/index.js'
import { string } from '~/attributes/string/index.js'
import { prefix } from '~/transformers/prefix.js'

import type { PrimitiveAttrParsedValue } from './primitive.js'

// Constraint
const assertConstraint: A.Equals<
  PrimitiveAttrParsedValue<PrimitiveAttribute>,
  ResolvedPrimitiveAttribute | undefined
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

// Transformed (custom)
const transformedSchemaCustom = string()
  .enum('foo', 'bar')
  .transform({
    parse: formatted => {
      const assertFormatted: A.Equals<typeof formatted, 'foo' | 'bar'> = 1
      assertFormatted

      return `PREFIX#${formatted}`
    },
    format: (transformed: string) => {
      const assertTransformed: A.Equals<typeof transformed, string> = 1
      assertTransformed

      return transformed.slice(7)
    }
  })
  .freeze()

const assertTransformedCustom: A.Equals<
  PrimitiveAttrParsedValue<typeof transformedSchemaCustom>,
  string
> = 1
assertTransformedCustom

// Transformed (lib)
const transformedSchemaLib = string()
  .enum('foo', 'bar')
  .transform(prefix('PREFIX', { delimiter: '.' }))
  .freeze()

const assertTransformedLib: A.Equals<
  PrimitiveAttrParsedValue<typeof transformedSchemaLib>,
  'PREFIX.foo' | 'PREFIX.bar'
> = 1
assertTransformedLib
