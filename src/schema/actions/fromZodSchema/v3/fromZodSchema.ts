import type { ZodSchema } from 'zod/v3'
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
} from 'zod/v3'

import type { Schema } from '~/schema/types/schema.js'

import type { FromZodSchema } from './types.js'
import { fromZodArray } from './zodArray.js'
import { fromZodBigInt } from './zodBigInt.js'
import { fromZodBoolean } from './zodBoolean.js'
import { fromZodCustom } from './zodCustom.js'
import { fromZodDefault } from './zodDefault.js'
import { fromZodDiscriminatedUnion } from './zodDiscriminatedUnion.js'
import { fromZodEffects } from './zodEffects.js'
import { fromZodEnum } from './zodEnum.js'
import { fromZodLiteral } from './zodLiteral.js'
import { fromZodNull } from './zodNull.js'
import { fromZodNumber } from './zodNumber.js'
import { fromZodObject } from './zodObject.js'
import { fromZodOptional } from './zodOptional.js'
import { fromZodRecord } from './zodRecord.js'
import { fromZodSet } from './zodSet.js'
import { fromZodString } from './zodString.js'
import { fromZodTuple } from './zodTuple.js'
import { fromZodUnion } from './zodUnion.js'

const _fromZodSchema = (zodSchema: ZodSchema): Schema => {
  if (zodSchema instanceof ZodNull) {
    return fromZodNull(zodSchema)
  }

  if (zodSchema instanceof ZodBoolean) {
    return fromZodBoolean(zodSchema)
  }

  if (zodSchema instanceof ZodNumber) {
    return fromZodNumber(zodSchema)
  }

  if (zodSchema instanceof ZodBigInt) {
    return fromZodBigInt(zodSchema)
  }

  if (zodSchema instanceof ZodString) {
    return fromZodString(zodSchema)
  }

  if (zodSchema instanceof ZodLiteral) {
    return fromZodLiteral(zodSchema)
  }

  if (zodSchema instanceof ZodEnum) {
    return fromZodEnum(zodSchema)
  }

  if (zodSchema instanceof ZodSet) {
    return fromZodSet(zodSchema)
  }

  if (zodSchema instanceof ZodArray) {
    return fromZodArray(zodSchema)
  }

  if (zodSchema instanceof ZodTuple) {
    return fromZodTuple(zodSchema)
  }

  if (zodSchema instanceof ZodObject) {
    return fromZodObject(zodSchema)
  }

  if (zodSchema instanceof ZodRecord) {
    return fromZodRecord(zodSchema)
  }

  if (zodSchema instanceof ZodUnion) {
    return fromZodUnion(zodSchema)
  }

  if (zodSchema instanceof ZodDiscriminatedUnion) {
    return fromZodDiscriminatedUnion(zodSchema)
  }

  if (zodSchema instanceof ZodOptional) {
    return fromZodOptional(zodSchema)
  }

  if (zodSchema instanceof ZodDefault) {
    return fromZodDefault(zodSchema)
  }

  if (zodSchema instanceof ZodEffects) {
    return fromZodEffects(zodSchema)
  }

  return fromZodCustom(zodSchema)
}

/**
 * Convert a `zod` schema to a DDB-TB schema.
 */
export const fromZodSchema = <ZOD_SCHEMA extends ZodSchema>(
  zodSchema: ZOD_SCHEMA
): FromZodSchema<ZOD_SCHEMA> => _fromZodSchema(zodSchema) as FromZodSchema<ZOD_SCHEMA>
