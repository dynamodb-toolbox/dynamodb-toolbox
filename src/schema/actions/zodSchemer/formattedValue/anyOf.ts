import { z } from 'zod'

import type { AnyOfSchema, Schema } from '~/schema/index.js'
import type { Cast } from '~/types/cast.js'

import type { ZodFormatter } from './schema.js'
import { getZodFormatter } from './schema.js'
import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type AnyOfZodFormatter<SCHEMA extends AnyOfSchema> = AddOptional<
  SCHEMA,
  SCHEMA['props'] extends { discriminator: string }
    ? z.ZodDiscriminatedUnion<
        SCHEMA['props']['discriminator'],
        AnyOfZodFormatterMap<SCHEMA['elements']>
      >
    : z.ZodUnion<
        Cast<AnyOfZodFormatterMap<SCHEMA['elements']>, readonly [z.ZodTypeAny, ...z.ZodTypeAny[]]>
      >
>

type AnyOfZodFormatterMap<
  SCHEMAS extends Schema[],
  RESULTS extends z.ZodTypeAny[] = []
> = SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
  ? SCHEMAS_HEAD extends Schema
    ? SCHEMAS_TAIL extends Schema[]
      ? AnyOfZodFormatterMap<SCHEMAS_TAIL, [...RESULTS, ZodFormatter<SCHEMAS_HEAD>]>
      : never
    : never
  : RESULTS

export const getAnyOfZodFormatter = (schema: AnyOfSchema): z.ZodTypeAny =>
  addOptional(
    schema,
    z.union(schema.elements.map(getZodFormatter) as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]])
  )
