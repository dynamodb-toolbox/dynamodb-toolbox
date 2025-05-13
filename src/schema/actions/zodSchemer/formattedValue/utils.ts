import type { z } from 'zod'

import type { Schema } from '~/index.js'

export type AddOptional<
  SCHEMA extends Schema,
  ZOD_SCHEMA extends z.ZodTypeAny
> = SCHEMA['props'] extends { required: 'never' } ? z.ZodOptional<ZOD_SCHEMA> : ZOD_SCHEMA

export const addOptional = (schema: Schema, zodSchema: z.ZodTypeAny): z.ZodTypeAny =>
  schema.props.required === 'never' ? zodSchema.optional() : zodSchema
