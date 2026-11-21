import { z } from 'zod/v4'

import type { AnyOfSchema, Schema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { SchemaZodFormatterRec, WithOptional } from './utils.js'
import { withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `anyOf` value.
 */
export type AnyOfZodFormatter<
  SCHEMA extends AnyOfSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = AnyOfSchema extends SCHEMA
  ? z.ZodType
  : WithOptional<
      SCHEMA,
      OPTIONS,
      SCHEMA['props'] extends { discriminator: string }
        ? z.ZodDiscriminatedUnion<
            SchemaZodFormatterRec<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>,
            SCHEMA['props']['discriminator']
          >
        : SCHEMA['elements'] extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
          ? SCHEMAS_HEAD extends Schema
            ? SCHEMAS_TAIL extends Schema[]
              ? // `z.union` infers a readonly tuple of options, where `z.discriminatedUnion` does not
                z.ZodUnion<
                  readonly [
                    SchemaZodFormatter<SCHEMAS_HEAD, Overwrite<OPTIONS, { defined: true }>>,
                    ...SchemaZodFormatterRec<SCHEMAS_TAIL, Overwrite<OPTIONS, { defined: true }>>
                  ]
                >
              : never
            : never
          : z.ZodType
    >

/**
 * Build a Zod schema validating a formatted `anyOf` value.
 */
export const anyOfZodFormatter = (
  schema: AnyOfSchema,
  options: ZodFormatterOptions = {}
): z.ZodType => {
  let zodFormatter: z.ZodType

  const { discriminator } = schema.props

  const zodElements = schema.elements.map(element =>
    schemaZodFormatter(element, { ...options, defined: true })
  )

  if (discriminator !== undefined) {
    // LIMITATION: Does not support `savedAs` attributes, whose decoder is a `z.preprocess`: its input
    // side is a generated transform rather than an object, which `z.discriminatedUnion` rejects.
    // Nor a nested *non*-discriminated `anyOf`, as a `z.union` is not discriminable either. Zod
    // builds its discriminator map lazily, so both throw on the first parse, not at build time.
    zodFormatter = z.discriminatedUnion(
      discriminator,
      /**
       * A discriminated union only accepts options that carry the discriminant, which the loose
       * `z.ZodType` of the recursion does not say: hence the double cast.
       */
      zodElements as unknown as [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]]
    )
  } else {
    zodFormatter = z.union(zodElements)
  }

  return withMeta(schema, withOptional(schema, withValidate(schema, zodFormatter), options))
}
