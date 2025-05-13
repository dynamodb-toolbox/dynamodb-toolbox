import type { z } from 'zod'

import type { Schema } from '~/index.js'

export type ZodLiteralMap<
  LITERALS extends z.Primitive[],
  RESULTS extends z.ZodLiteral<z.Primitive>[] = []
> = LITERALS extends [infer LITERALS_HEAD, ...infer LITERALS_TAIL]
  ? LITERALS_HEAD extends z.Primitive
    ? LITERALS_TAIL extends z.Primitive[]
      ? ZodLiteralMap<LITERALS_TAIL, [...RESULTS, z.ZodLiteral<LITERALS_HEAD>]>
      : never
    : never
  : RESULTS

export type AddOptional<
  SCHEMA extends Schema,
  ZOD_SCHEMA extends z.ZodTypeAny
> = SCHEMA['props'] extends { required: 'never' } ? z.ZodOptional<ZOD_SCHEMA> : ZOD_SCHEMA

export const addOptional = (schema: Schema, zodSchema: z.ZodTypeAny): z.ZodTypeAny =>
  schema.props.required === 'never' ? zodSchema.optional() : zodSchema
