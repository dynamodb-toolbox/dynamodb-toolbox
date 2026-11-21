import { z } from 'zod/v4'

import type { ItemSchema, MapSchema, Schema, TransformedValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/transformer.js'
import type { Extends, If, Or } from '~/types/index.js'

import type { SavedAsAttributes } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'

/**
 * Zod formatters of a tuple of schemas, preserving positions.
 */
export type SchemaZodFormatterRec<
  SCHEMAS extends Schema[],
  OPTIONS extends ZodFormatterOptions = {},
  RESULTS extends z.ZodType[] = []
> = SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
  ? SCHEMAS_HEAD extends Schema
    ? SCHEMAS_TAIL extends Schema[]
      ? SchemaZodFormatterRec<
          SCHEMAS_TAIL,
          OPTIONS,
          [...RESULTS, SchemaZodFormatter<SCHEMAS_HEAD, OPTIONS>]
        >
      : never
    : never
  : RESULTS

/**
 * Wrap a Zod schema as optional unless the value is always defined.
 */
export type WithOptional<
  SCHEMA extends Schema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodType
> = If<
  Extends<OPTIONS, { defined: true }>,
  ZOD_SCHEMA,
  If<
    Or<Extends<OPTIONS, { partial: true }>, Extends<SCHEMA['props'], { required: 'never' }>>,
    z.ZodOptional<ZOD_SCHEMA>,
    ZOD_SCHEMA
  >
>

/**
 * Make a Zod schema optional unless the value is always defined.
 */
export const withOptional = (
  schema: Schema,
  zodSchema: z.ZodType,
  { partial, defined }: ZodFormatterOptions
): z.ZodType => {
  if (defined === true) {
    return zodSchema
  }

  if (partial === true || schema.props.required === 'never') {
    return z.optional(zodSchema)
  }

  return zodSchema
}

/**
 * Wrap a Zod schema to reverse the attribute's transformer on read.
 */
export type WithDecoding<
  SCHEMA extends Schema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodType
> = If<
  Extends<OPTIONS, { transform: false }>,
  ZOD_SCHEMA,
  If<
    Extends<SCHEMA['props'], { transform: Transformer }>,
    z.ZodPreprocess<ZOD_SCHEMA, TransformedValue<SCHEMA>>,
    ZOD_SCHEMA
  >
>

/**
 * Preprocess a Zod schema to reverse the attribute's transformer on read.
 */
export const withDecoding = (
  schema: Extract<Schema, { props: { transform?: unknown } }>,
  zodSchema: z.ZodType,
  { transform }: ZodFormatterOptions
): z.ZodType => {
  // Every schema type declares `transform` as `unknown`, so reading it as a transformer is a cast
  const transformer = schema.props.transform as Transformer | undefined

  if (transform === false || transformer === undefined) {
    return zodSchema
  }

  return z.preprocess(encoded => transformer.decode(encoded), zodSchema)
}

/**
 * Wrap a Zod schema to map saved attribute names back to their keys.
 */
export type WithAttributeNameDecoding<
  SCHEMA extends MapSchema | ItemSchema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodType
> = If<
  Or<Extends<OPTIONS, { transform: false }>, Extends<[SavedAsAttributes<SCHEMA>], [never]>>,
  ZOD_SCHEMA,
  z.ZodPreprocess<ZOD_SCHEMA, TransformedValue<SCHEMA>>
>

/**
 * Preprocess a Zod schema to map saved attribute names back to their keys.
 */
export const withAttributeNameDecoding = (
  schema: MapSchema | ItemSchema,
  zodSchema: z.ZodType,
  { transform }: ZodFormatterOptions
): z.ZodType => {
  if (
    transform === false ||
    Object.values(schema.attributes).every(attribute => attribute.props.savedAs === undefined)
  ) {
    return zodSchema
  }

  return z.preprocess(compileAttributeNameDecoder(schema), zodSchema)
}

/**
 * Build a decoder mapping saved attribute names back to their keys.
 */
export const compileAttributeNameDecoder =
  (schema: MapSchema | ItemSchema) =>
  (encoded: unknown): Record<string, unknown> => {
    const decoded: Record<string, unknown> = {}

    // The decoder runs ahead of the object schema, on a value DynamoDB has already shaped
    const encodedAttributes = encoded as Record<string, unknown>

    for (const [attrName, attribute] of Object.entries(schema.attributes)) {
      decoded[attrName] = encodedAttributes[attribute.props.savedAs ?? attrName]
    }

    return decoded
  }
