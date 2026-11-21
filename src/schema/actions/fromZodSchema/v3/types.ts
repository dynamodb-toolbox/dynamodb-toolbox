import type {
  ZodBigInt,
  ZodBoolean,
  ZodNull,
  ZodNumber,
  ZodSchema,
  ZodSet,
  ZodString,
  ZodType
} from 'zod/v3'

import type { Schema } from '~/schema/types/schema.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import type { FromZodArray, ZodArrayAny } from './zodArray.js'
import type { FromZodBigInt } from './zodBigInt.js'
import type { FromZodBoolean } from './zodBoolean.js'
import type { FromZodCustom } from './zodCustom.js'
import type { FromZodDefault, ZodDefaultAny } from './zodDefault.js'
import type {
  FromZodDiscriminatedUnion,
  ZodDiscriminatedUnionAny
} from './zodDiscriminatedUnion.js'
import type { FromZodEffects, ZodEffectsAny } from './zodEffects.js'
import type { FromZodEnum, ZodEnumAny } from './zodEnum.js'
import type { FromZodLiteral, ZodLiteralAny } from './zodLiteral.js'
import type { FromZodNull } from './zodNull.js'
import type { FromZodNumber } from './zodNumber.js'
import type { FromZodObject, ZodObjectAny } from './zodObject.js'
import type { FromZodOptional, ZodOptionalAny } from './zodOptional.js'
import type { FromZodRecord, ZodRecordAny } from './zodRecord.js'
import type { FromZodSet } from './zodSet.js'
import type { FromZodString } from './zodString.js'
import type { FromZodTuple, ZodTupleAny } from './zodTuple.js'
import type { FromZodUnion, ZodUnionAny } from './zodUnion.js'

type ZodSpecialSchema =
  | ZodNull
  | ZodBoolean
  | ZodNumber
  | ZodBigInt
  | ZodString
  | ZodLiteralAny
  | ZodEnumAny
  | ZodSet
  | ZodArrayAny
  | ZodTupleAny
  | ZodObjectAny
  | ZodRecordAny
  | ZodUnionAny
  | ZodDiscriminatedUnionAny
  | ZodOptionalAny
  | ZodDefaultAny
  | ZodEffectsAny

type FromZodSpecialSchema<
  ZOD_SCHEMA extends ZodSpecialSchema,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ZOD_SCHEMA extends ZodSpecialSchema
  ? | (ZOD_SCHEMA extends ZodNull ? FromZodNull<ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodBoolean ? FromZodBoolean<ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodNumber ? FromZodNumber<ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodBigInt ? FromZodBigInt<ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodString ? FromZodString<ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodLiteralAny ? FromZodLiteral<ZOD_SCHEMA, ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodEnumAny ? FromZodEnum<ZOD_SCHEMA, ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodSet ? FromZodSet<ZOD_SCHEMA, ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodArrayAny ? FromZodArray<ZOD_SCHEMA, ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodTupleAny ? FromZodTuple<ZOD_SCHEMA, ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodObjectAny ? FromZodObject<ZOD_SCHEMA, ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodRecordAny ? FromZodRecord<ZOD_SCHEMA, ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodUnionAny ? FromZodUnion<ZOD_SCHEMA, ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodDiscriminatedUnionAny
        ? FromZodDiscriminatedUnion<ZOD_SCHEMA, ROOT, PROPS>
        : never)
    | (ZOD_SCHEMA extends ZodOptionalAny ? FromZodOptional<ZOD_SCHEMA, ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodDefaultAny ? FromZodDefault<ZOD_SCHEMA, ROOT, PROPS> : never)
    | (ZOD_SCHEMA extends ZodEffectsAny ? FromZodEffects<ZOD_SCHEMA, ROOT, PROPS> : never)
  : never

type ZodGeneralSchema = ZodType

type FromZodGeneralSchema<
  ZOD_SCHEMA extends ZodGeneralSchema,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = FromZodCustom<ZOD_SCHEMA, ROOT, PROPS>

/**
 * DDB-TB schema derived from a `zod` schema.
 */
export type FromZodSchema<
  ZOD_SCHEMA extends ZodSchema,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ZOD_SCHEMA extends ZodSpecialSchema
  ? FromZodSpecialSchema<ZOD_SCHEMA, ROOT, PROPS>
  : ZOD_SCHEMA extends ZodType
    ? FromZodGeneralSchema<ZOD_SCHEMA, ROOT, PROPS>
    : never

/**
 * DDB-TB schemas derived from a tuple of `zod` schemas.
 */
export type FromZodSchemaRec<
  ZOD_SCHEMAS extends readonly ZodSchema[],
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {},
  RESULT_SCHEMAS extends Schema[] = []
> = ZOD_SCHEMAS extends [
  infer ZOD_SCHEMAS_HEAD extends ZodSchema,
  ...infer ZOD_SCHEMAS_TAIL extends ZodSchema[]
]
  ? FromZodSchemaRec<
      ZOD_SCHEMAS_TAIL,
      ROOT,
      PROPS,
      [...RESULT_SCHEMAS, FromZodSchema<ZOD_SCHEMAS_HEAD, ROOT, PROPS>]
    >
  : RESULT_SCHEMAS
