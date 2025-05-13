import { z } from 'zod'

import type {
  BinarySchema,
  BooleanSchema,
  NullSchema,
  NumberSchema,
  StringSchema
} from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedNullZodSchema<SCHEMA extends NullSchema> = AddOptional<SCHEMA, z.ZodNull>

export const getFormattedNullZodSchema = (schema: NullSchema): z.ZodTypeAny =>
  addOptional(schema, z.null())

export type FormattedBooleanZodSchema<SCHEMA extends BooleanSchema> = AddOptional<
  SCHEMA,
  z.ZodBoolean
>

export const getFormattedBooleanZodSchema = (schema: BooleanSchema): z.ZodTypeAny =>
  addOptional(schema, z.boolean())

export type FormattedNumberZodSchema<SCHEMA extends NumberSchema> = AddOptional<SCHEMA, z.ZodNumber>

export const getFormattedNumberZodSchema = (schema: NumberSchema): z.ZodTypeAny =>
  addOptional(schema, z.number())

export type FormattedStringZodSchema<SCHEMA extends StringSchema> = AddOptional<SCHEMA, z.ZodString>

export const getFormattedStringZodSchema = (schema: StringSchema): z.ZodTypeAny =>
  addOptional(schema, z.string())

export type FormattedBinaryZodSchema<SCHEMA extends BinarySchema> = AddOptional<
  SCHEMA,
  z.ZodType<Uint8Array>
>

export const getFormattedBinaryZodSchema = (schema: BinarySchema): z.ZodTypeAny =>
  addOptional(schema, z.instanceof(Uint8Array))
