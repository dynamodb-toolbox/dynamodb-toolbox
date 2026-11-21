import { z } from 'zod/v4'

import type { AnyOfSchema, Schema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { SchemaZodParserRec, WithDefault, WithOptional } from './utils.js'
import { withDefault, withOptional } from './utils.js'

/**
 * Zod schema validating an input `anyOf` value.
 */
export type AnyOfZodParser<
  SCHEMA extends AnyOfSchema,
  OPTIONS extends ZodParserOptions = {}
> = AnyOfSchema extends SCHEMA
  ? z.ZodType
  : WithDefault<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        SCHEMA['props'] extends { discriminator: string }
          ? z.ZodDiscriminatedUnion<
              SchemaZodParserRec<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>,
              SCHEMA['props']['discriminator']
            >
          : SCHEMA['elements'] extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
            ? SCHEMAS_HEAD extends Schema
              ? SCHEMAS_TAIL extends Schema[]
                ? // `z.union` infers a readonly tuple of options, where `z.discriminatedUnion` does not
                  z.ZodUnion<
                    readonly [
                      SchemaZodParser<SCHEMAS_HEAD, Overwrite<OPTIONS, { defined: true }>>,
                      ...SchemaZodParserRec<SCHEMAS_TAIL, Overwrite<OPTIONS, { defined: true }>>
                    ]
                  >
                : never
              : never
            : z.ZodType
      >
    >

/**
 * Build a Zod schema validating an input `anyOf` value.
 */
export const anyOfZodParser = (schema: AnyOfSchema, options: ZodParserOptions = {}): z.ZodType => {
  let zodParser: z.ZodType

  const { discriminator } = schema.props

  const zodElements = schema.elements.map(element =>
    schemaZodParser(element, { ...options, defined: true })
  )

  if (discriminator !== undefined) {
    // LIMITATION: Does not support nested `anyOf`s for now, although the upgraded `z.discriminatedUnion` may allow it: https://v4.zod.dev/v4#upgraded-zdiscriminatedunion
    // LIMITATION: Does not support `savedAs` attributes for now as ZodPipes are not valid discriminatedUnion options
    zodParser = z.discriminatedUnion(
      discriminator,
      /**
       * A discriminated union only accepts options that carry the discriminant, which the loose
       * `z.ZodType` of the recursion does not say: hence the double cast.
       */
      zodElements as unknown as [z.core.$ZodTypeDiscriminable, ...z.core.$ZodTypeDiscriminable[]]
    )
  } else {
    zodParser = z.union(zodElements)
  }

  return withMeta(
    schema,
    withDefault(schema, withOptional(schema, withValidate(schema, zodParser), options), options)
  )
}
