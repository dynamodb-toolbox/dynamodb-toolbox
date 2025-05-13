import { z } from 'zod'

import type {
  BinarySchema,
  BooleanSchema,
  NullSchema,
  NumberSchema,
  StringSchema
} from '~/schema/index.js'

export type FormattedNullZodSchema<SCHEMA extends NullSchema> = z.ZodNull

export const getFormattedNullZodSchema = (schema: NullSchema): z.ZodTypeAny => z.null()

export type FormattedBooleanZodSchema<SCHEMA extends BooleanSchema> = z.ZodBoolean

export const getFormattedBooleanZodSchema = (schema: BooleanSchema): z.ZodTypeAny => z.boolean()

export type FormattedNumberZodSchema<SCHEMA extends NumberSchema> = z.ZodNumber

export const getFormattedNumberZodSchema = (schema: NumberSchema): z.ZodTypeAny => z.number()

export type FormattedStringZodSchema<SCHEMA extends StringSchema> = z.ZodString

export const getFormattedStringZodSchema = (schema: StringSchema): z.ZodTypeAny => z.string()

export type FormattedBinaryZodSchema<SCHEMA extends BinarySchema> = z.ZodType<Uint8Array>

export const getFormattedBinaryZodSchema = (schema: BinarySchema): z.ZodTypeAny =>
  z.instanceof(Uint8Array)
