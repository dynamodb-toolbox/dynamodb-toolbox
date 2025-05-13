import { z } from 'zod'

import type { AnyOfSchema, Schema } from '~/schema/index.js'
import type { Cast } from '~/types/cast.js'

import type { FormattedValueZodSchema } from './schema.js'
import { getFormattedValueZodSchema } from './schema.js'

export type FormattedAnyOfZodSchema<SCHEMA extends AnyOfSchema> = z.ZodUnion<
  Cast<FormattedAnyOfZodSchemaMap<SCHEMA['elements']>, readonly [z.ZodTypeAny, ...z.ZodTypeAny[]]>
>

type FormattedAnyOfZodSchemaMap<
  SCHEMAS extends Schema[],
  RESULTS extends z.ZodTypeAny[] = []
> = SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAILS]
  ? SCHEMAS_HEAD extends Schema
    ? SCHEMAS_TAILS extends Schema[]
      ? FormattedAnyOfZodSchemaMap<
          SCHEMAS_TAILS,
          [...RESULTS, FormattedValueZodSchema<SCHEMAS_HEAD>]
        >
      : never
    : never
  : RESULTS

export const getFormattedAnyOfZodSchema = (schema: AnyOfSchema): z.ZodTypeAny =>
  z.union(
    schema.elements.map(getFormattedValueZodSchema) as [
      z.ZodTypeAny,
      z.ZodTypeAny,
      ...z.ZodTypeAny[]
    ]
  )
