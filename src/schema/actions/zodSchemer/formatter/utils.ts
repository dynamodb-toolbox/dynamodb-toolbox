import { z } from 'zod'

import type { Schema } from '~/index.js'

import type { ZodFormatterOptions } from './types.js'

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

export type OptionalWrapper<
  SCHEMA extends Schema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = OPTIONS extends { partial: true; defined?: false }
  ? z.ZodOptional<ZOD_SCHEMA>
  : SCHEMA['props'] extends { required: 'never' }
    ? z.ZodOptional<ZOD_SCHEMA>
    : ZOD_SCHEMA

export const optionalWrapper = (
  schema: Schema,
  { partial = false, defined = false }: ZodFormatterOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  (partial && !defined) || schema.props.required === 'never' ? z.optional(zodSchema) : zodSchema
