import { z } from 'zod/v4'

import type { ItemSchema, MapSchema, Schema, TransformedValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/transformer.js'
import type { Extends, If, Or } from '~/types/index.js'

import type { SavedAsAttributes } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'

/**
 * Zod parsers of a tuple of schemas, preserving positions.
 */
export type SchemaZodParserRec<
  SCHEMAS extends Schema[],
  OPTIONS extends ZodParserOptions = {},
  RESULTS extends z.ZodType[] = []
> = SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
  ? SCHEMAS_HEAD extends Schema
    ? SCHEMAS_TAIL extends Schema[]
      ? SchemaZodParserRec<
          SCHEMAS_TAIL,
          OPTIONS,
          [...RESULTS, SchemaZodParser<SCHEMAS_HEAD, OPTIONS>]
        >
      : never
    : never
  : RESULTS

/**
 * Wrap a Zod schema with the schema's default value, if any.
 */
export type WithDefault<
  SCHEMA extends Schema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodType
> = If<
  Extends<OPTIONS, { fill: false }>,
  ZOD_SCHEMA,
  If<
    Or<
      Extends<SCHEMA['props'], { key: true; keyDefault: unknown }>,
      Extends<SCHEMA['props'], { key?: false; putDefault: unknown }>
    >,
    z.ZodDefault<ZOD_SCHEMA>,
    ZOD_SCHEMA
  >
>

/**
 * Apply the schema's default value to a Zod schema.
 */
export const withDefault = (
  schema: Schema,
  zodSchema: z.ZodType,
  { fill }: ZodParserOptions
): z.ZodType => {
  if (fill === false) {
    return zodSchema
  }

  const { key = false, keyDefault, putDefault } = schema.props

  if (key && keyDefault !== undefined) {
    return zodSchema.default(keyDefault)
  }

  if (putDefault !== undefined) {
    return zodSchema.default(putDefault)
  }

  return zodSchema
}

/**
 * Wrap a Zod schema as optional unless the value is always defined.
 */
export type WithOptional<
  SCHEMA extends Schema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodType
> = If<
  Extends<OPTIONS, { defined: true }>,
  ZOD_SCHEMA,
  If<Extends<SCHEMA['props'], { required: 'never' }>, z.ZodOptional<ZOD_SCHEMA>, ZOD_SCHEMA>
>

/**
 * Make a Zod schema optional unless the value is always defined.
 */
export const withOptional = (
  schema: Schema,
  zodSchema: z.ZodType,
  { defined }: ZodParserOptions
): z.ZodType => {
  if (defined === true || schema.props.required !== 'never') {
    return zodSchema
  }

  return z.optional(zodSchema)
}

/**
 * Wrap a Zod schema to apply the attribute's transformer on write.
 */
export type WithEncoding<
  SCHEMA extends Schema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodType
> = If<
  Extends<OPTIONS, { transform: false }>,
  ZOD_SCHEMA,
  If<
    Extends<SCHEMA['props'], { transform: Transformer }>,
    z.ZodPipe<ZOD_SCHEMA, z.ZodTransform<TransformedValue<SCHEMA>, z.output<ZOD_SCHEMA>>>,
    ZOD_SCHEMA
  >
>

/**
 * Transform a Zod schema to apply the attribute's transformer on write.
 */
export const withEncoding = (
  schema: Extract<Schema, { props: { transform?: unknown } }>,
  zodSchema: z.ZodType,
  { transform }: ZodParserOptions
): z.ZodType => {
  // Every schema type declares `transform` as `unknown`, so reading it as a transformer is a cast
  const transformer = schema.props.transform as Transformer | undefined

  if (transform === false || transformer === undefined) {
    return zodSchema
  }

  return zodSchema.transform(decoded => transformer.encode(decoded))
}

/**
 * Wrap a Zod schema to map attribute keys to their saved names.
 */
export type WithAttributeNameEncoding<
  SCHEMA extends MapSchema | ItemSchema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodType
> = If<
  Or<Extends<OPTIONS, { transform: false }>, Extends<[SavedAsAttributes<SCHEMA>], [never]>>,
  ZOD_SCHEMA,
  z.ZodPipe<ZOD_SCHEMA, z.ZodTransform<TransformedValue<SCHEMA>, z.output<ZOD_SCHEMA>>>
>

/**
 * Transform a Zod schema to map attribute keys to their saved names.
 */
export const withAttributeNameEncoding = (
  schema: MapSchema | ItemSchema,
  zodSchema: z.ZodType,
  { transform }: ZodParserOptions
): z.ZodType => {
  if (
    transform === false ||
    Object.values(schema.attributes).every(attribute => attribute.props.savedAs === undefined)
  ) {
    return zodSchema
  }

  return zodSchema.transform(compileAttributeNameEncoder(schema))
}

/**
 * Build an encoder mapping attribute keys to their saved names.
 */
export const compileAttributeNameEncoder =
  (schema: MapSchema | ItemSchema) =>
  (decoded: unknown): Record<string, unknown> => {
    const encoded: Record<string, unknown> = {}

    // The encoder only runs behind the object schema that has just validated the value
    const decodedAttributes = decoded as Record<string, unknown>

    for (const [attrName, attribute] of Object.entries(schema.attributes)) {
      const savedAs = attribute.props.savedAs ?? attrName
      encoded[savedAs] = decodedAttributes[attrName]
    }

    return encoded
  }
