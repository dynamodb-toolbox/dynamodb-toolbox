import { z } from 'zod'

import type { AnyOfSchema, Schema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { OptionalWrapper } from './utils.js'
import { optionalWrapper } from './utils.js'

export type AnyOfZodFormatter<
  SCHEMA extends AnyOfSchema,
  OPTIONS extends ZodFormatterOptions
> = AnyOfSchema extends SCHEMA
  ? z.ZodTypeAny
  : OptionalWrapper<
      SCHEMA,
      OPTIONS,
      SCHEMA['props'] extends { discriminator: string }
        ? z.ZodDiscriminatedUnion<
            SCHEMA['props']['discriminator'],
            MapAnyOfZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>
          >
        : SCHEMA['elements'] extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
          ? SCHEMAS_HEAD extends Schema
            ? SCHEMAS_TAIL extends Schema[]
              ? z.ZodUnion<
                  [
                    SchemaZodFormatter<SCHEMAS_HEAD, Overwrite<OPTIONS, { defined: true }>>,
                    ...MapAnyOfZodFormatter<SCHEMAS_TAIL, Overwrite<OPTIONS, { defined: true }>>
                  ]
                >
              : never
            : never
          : z.ZodTypeAny
    >

type MapAnyOfZodFormatter<
  SCHEMAS extends Schema[],
  OPTIONS extends ZodFormatterOptions,
  RESULTS extends z.ZodTypeAny[] = []
> = SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
  ? SCHEMAS_HEAD extends Schema
    ? SCHEMAS_TAIL extends Schema[]
      ? MapAnyOfZodFormatter<
          SCHEMAS_TAIL,
          OPTIONS,
          [...RESULTS, SchemaZodFormatter<SCHEMAS_HEAD, OPTIONS>]
        >
      : never
    : never
  : RESULTS

export const anyOfZodFormatter = (
  schema: AnyOfSchema,
  options: ZodFormatterOptions
): z.ZodTypeAny =>
  optionalWrapper(
    schema,
    options,
    z.union(
      schema.elements.map(element =>
        schemaZodFormatter(element, { ...options, defined: true })
      ) as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]
    )
  )
