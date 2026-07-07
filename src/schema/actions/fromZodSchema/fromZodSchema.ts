import type { ZodSchema, ZodType } from 'zod'
import {
  ZodArray,
  ZodBigInt,
  ZodBoolean,
  ZodDefault,
  ZodDiscriminatedUnion,
  ZodEffects,
  ZodEnum,
  ZodLiteral,
  ZodNull,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRecord,
  ZodSet,
  ZodString,
  ZodTuple,
  ZodUnion
} from 'zod'

import type { Schema } from '~/schema/types/schema.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import type { FromZodArray, ZodArrayAny } from './zodArray.js'
import { fromZodArray } from './zodArray.js'
import type { FromZodBigInt } from './zodBigInt.js'
import { fromZodBigInt } from './zodBigInt.js'
import type { FromZodBoolean } from './zodBoolean.js'
import { fromZodBoolean } from './zodBoolean.js'
import type { FromZodCustom } from './zodCustom.js'
import { fromZodCustom } from './zodCustom.js'
import type { FromZodDefault, ZodDefaultAny } from './zodDefault.js'
import { fromZodDefault } from './zodDefault.js'
import type {
  FromZodDiscriminatedUnion,
  ZodDiscriminatedUnionAny
} from './zodDiscriminatedUnion.js'
import { fromZodDiscriminatedUnion } from './zodDiscriminatedUnion.js'
import type { FromZodEffects, ZodEffectsAny } from './zodEffects.js'
import { fromZodEffects } from './zodEffects.js'
import type { FromZodEnum, ZodEnumAny } from './zodEnum.js'
import { fromZodEnum } from './zodEnum.js'
import type { FromZodLiteral, ZodLiteralAny } from './zodLiteral.js'
import { fromZodLiteral } from './zodLiteral.js'
import type { FromZodNull } from './zodNull.js'
import { fromZodNull } from './zodNull.js'
import type { FromZodNumber } from './zodNumber.js'
import { fromZodNumber } from './zodNumber.js'
import type { FromZodObject, ZodObjectAny } from './zodObject.js'
import { fromZodObject } from './zodObject.js'
import type { FromZodOptional, ZodOptionalAny } from './zodOptional.js'
import { fromZodOptional } from './zodOptional.js'
import type { FromZodRecord, ZodRecordAny } from './zodRecord.js'
import { fromZodRecord } from './zodRecord.js'
import type { FromZodSet } from './zodSet.js'
import { fromZodSet } from './zodSet.js'
import type { FromZodString } from './zodString.js'
import { fromZodString } from './zodString.js'
import type { FromZodTuple, ZodTupleAny } from './zodTuple.js'
import { fromZodTuple } from './zodTuple.js'
import type { FromZodUnion, ZodUnionAny } from './zodUnion.js'
import { fromZodUnion } from './zodUnion.js'

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
  ?
      | (ZOD_SCHEMA extends ZodNull ? FromZodNull<ROOT, PROPS> : never)
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

export type FromZodSchema<
  ZOD_SCHEMA extends ZodSchema,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ZOD_SCHEMA extends ZodSpecialSchema
  ? FromZodSpecialSchema<ZOD_SCHEMA, ROOT, PROPS>
  : ZOD_SCHEMA extends ZodType
    ? FromZodGeneralSchema<ZOD_SCHEMA, ROOT, PROPS>
    : never

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

export const fromZodSchema = <ZOD_SCHEMA extends ZodSchema>(
  zodSchema: ZOD_SCHEMA
): FromZodSchema<ZOD_SCHEMA> => {
  if (zodSchema instanceof ZodNull) {
    return fromZodNull() as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodBoolean) {
    return fromZodBoolean() as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodNumber) {
    return fromZodNumber() as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodBigInt) {
    return fromZodBigInt() as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodString) {
    return fromZodString() as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodLiteral) {
    return fromZodLiteral(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodEnum) {
    return fromZodEnum(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodSet) {
    return fromZodSet(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodArray) {
    return fromZodArray(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodTuple) {
    return fromZodTuple(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodObject) {
    return fromZodObject(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodRecord) {
    return fromZodRecord(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodUnion) {
    return fromZodUnion(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodDiscriminatedUnion) {
    return fromZodDiscriminatedUnion(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodOptional) {
    return fromZodOptional(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  if (zodSchema instanceof ZodDefault) {
    return fromZodDefault(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  // TODO: Codecs<>transforms in zod v4
  if (zodSchema instanceof ZodEffects) {
    return fromZodEffects(zodSchema) as FromZodSchema<ZOD_SCHEMA>
  }

  return fromZodCustom() as FromZodSchema<ZOD_SCHEMA>
}
