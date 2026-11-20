import type {
  $ZodArray,
  $ZodBigInt,
  $ZodBoolean,
  $ZodDefault,
  $ZodDiscriminatedUnion,
  $ZodEnum,
  $ZodLiteral,
  $ZodNull,
  $ZodNumber,
  $ZodObject,
  $ZodOptional,
  $ZodRecord,
  $ZodSet,
  $ZodString,
  $ZodTuple,
  $ZodUnion,
  SomeType
} from 'zod/v4/core'

import type { Schema } from '~/schema/types/schema.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { FromZodArray } from './zodArray.js'
import type { FromZodBigInt } from './zodBigInt.js'
import type { FromZodBoolean } from './zodBoolean.js'
import type { FromZodCustom } from './zodCustom.js'
import type { FromZodDefault } from './zodDefault.js'
import type { FromZodDiscriminatedUnion } from './zodDiscriminatedUnion.js'
import type { FromZodEnum } from './zodEnum.js'
import type { FromZodLiteral } from './zodLiteral.js'
import type { FromZodNull } from './zodNull.js'
import type { FromZodNumber } from './zodNumber.js'
import type { FromZodObject } from './zodObject.js'
import type { FromZodOptional } from './zodOptional.js'
import type { FromZodPipe } from './zodPipe.js'
import type { FromZodRecord } from './zodRecord.js'
import type { FromZodSet } from './zodSet.js'
import type { FromZodString } from './zodString.js'
import type { FromZodTuple } from './zodTuple.js'
import type { FromZodUnion } from './zodUnion.js'

/**
 * Schema props carrying the values of a `zod` enum or multi-value literal.
 *
 * @debt type "The arity is lost: `$ZodEnumDef.entries` and `$ZodLiteralDef.values` are arrays of unknown length at the type level, so the values can only be modelled as a union"
 */
export type EnumProps<VALUES, PROPS extends SchemaProps> = Overwrite<PROPS, { enum: VALUES[] }>

/**
 * Discriminants of the `zod` nodes with a DynamoDB-Toolbox counterpart. Any other node degrades to
 * an `any` schema, through the last arm of `FromZodSchema`.
 */
type MappedZodNode =
  | 'null'
  | 'boolean'
  | 'number'
  | 'bigint'
  | 'string'
  | 'literal'
  | 'enum'
  | 'set'
  | 'array'
  | 'tuple'
  | 'object'
  | 'record'
  | 'union'
  | 'optional'
  | 'default'
  | 'pipe'

/**
 * DDB-TB schema derived from a `zod` schema.
 *
 * One arm per node the `switch` of `fromZodSchema` maps, as a flat union rather than a chain: each
 * `extends` narrows the schema for its own mapper, and the arms exclude each other, so their order
 * carries no meaning.
 */
export type FromZodSchema<
  ZOD_SCHEMA extends SomeType,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  | (ZOD_SCHEMA extends $ZodNull ? FromZodNull<ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodBoolean ? FromZodBoolean<ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodNumber ? FromZodNumber<ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodBigInt ? FromZodBigInt<ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodString ? FromZodString<ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodLiteral ? FromZodLiteral<ZOD_SCHEMA, ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodEnum ? FromZodEnum<ZOD_SCHEMA, ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodSet ? FromZodSet<ZOD_SCHEMA, ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodArray ? FromZodArray<ZOD_SCHEMA, ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodTuple ? FromZodTuple<ZOD_SCHEMA, ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodObject ? FromZodObject<ZOD_SCHEMA, ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodRecord ? FromZodRecord<ZOD_SCHEMA, ROOT, PROPS> : never)
  /**
   * `z.discriminatedUnion()` is a `$ZodUnion` too, so both kinds of union share one arm — as they
   * share the `union` case of the `switch`.
   */
  | (ZOD_SCHEMA extends $ZodDiscriminatedUnion
      ? FromZodDiscriminatedUnion<ZOD_SCHEMA, ROOT, PROPS>
      : ZOD_SCHEMA extends $ZodUnion
        ? FromZodUnion<ZOD_SCHEMA, ROOT, PROPS>
        : never)
  | (ZOD_SCHEMA extends $ZodOptional ? FromZodOptional<ZOD_SCHEMA, ROOT, PROPS> : never)
  | (ZOD_SCHEMA extends $ZodDefault ? FromZodDefault<ZOD_SCHEMA, ROOT, PROPS> : never)
  /**
   * `$ZodPreprocess` narrows `in` to a `$ZodTransform`, which makes it fail a structural match
   * against `$ZodPipe`. The discriminant is what both kinds of pipe have in common — and the one
   * the runtime switches on.
   */
  | (ZOD_SCHEMA['_zod']['def']['type'] extends 'pipe'
      ? FromZodPipe<ZOD_SCHEMA, ROOT, PROPS>
      : never)
  // Every other node degrades, as in the `switch`
  | (ZOD_SCHEMA['_zod']['def']['type'] extends MappedZodNode
      ? never
      : FromZodCustom<ZOD_SCHEMA, ROOT, PROPS>)

/**
 * DDB-TB schemas derived from a tuple of `zod` schemas.
 */
export type FromZodSchemaRec<
  ZOD_SCHEMAS extends readonly SomeType[],
  ROOT extends boolean = true,
  RESULT_SCHEMAS extends Schema[] = []
> = ZOD_SCHEMAS extends readonly [
  infer ZOD_SCHEMAS_HEAD extends SomeType,
  ...infer ZOD_SCHEMAS_TAIL extends readonly SomeType[]
]
  ? FromZodSchemaRec<
      ZOD_SCHEMAS_TAIL,
      ROOT,
      [...RESULT_SCHEMAS, FromZodSchema<ZOD_SCHEMAS_HEAD, ROOT>]
    >
  : RESULT_SCHEMAS
