import { z } from 'zod'

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
  RESULTS extends z.ZodTypeAny[] = []
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
 * Zod literals of a tuple of primitives, preserving positions.
 */
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

/**
 * Wrap a Zod schema with the schema's default value, if any.
 */
export type WithDefault<
  SCHEMA extends Schema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
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
  { fill }: ZodParserOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  fill === false
    ? zodSchema
    : schema.props.key === true && schema.props.keyDefault !== undefined
      ? zodSchema.default(schema.props.keyDefault)
      : schema.props.putDefault !== undefined
        ? zodSchema.default(schema.props.putDefault)
        : zodSchema

/**
 * Wrap a Zod schema as optional unless the value is always defined.
 */
export type WithOptional<
  SCHEMA extends Schema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
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
  { defined }: ZodParserOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  defined === true
    ? zodSchema
    : schema.props.required === 'never'
      ? z.optional(zodSchema)
      : zodSchema

/**
 * Wrap a Zod schema to apply the attribute's transformer on write.
 */
export type WithEncoding<
  SCHEMA extends Schema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = If<
  Extends<OPTIONS, { transform: false }>,
  ZOD_SCHEMA,
  If<
    Extends<SCHEMA['props'], { transform: Transformer }>,
    z.ZodEffects<ZOD_SCHEMA, TransformedValue<SCHEMA>, z.input<ZOD_SCHEMA>>,
    ZOD_SCHEMA
  >
>

/**
 * Transform a Zod schema to apply the attribute's transformer on write.
 */
export const withEncoding = (
  schema: Extract<Schema, { props: { transform?: unknown } }>,
  { transform }: ZodParserOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  transform === false
    ? zodSchema
    : schema.props.transform !== undefined
      ? zodSchema.transform(decoded => (schema.props.transform as Transformer).encode(decoded))
      : zodSchema

/**
 * Wrap a Zod schema to map attribute keys to their saved names.
 */
export type WithAttributeNameEncoding<
  SCHEMA extends MapSchema | ItemSchema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = If<
  Or<Extends<OPTIONS, { transform: false }>, Extends<[SavedAsAttributes<SCHEMA>], [never]>>,
  ZOD_SCHEMA,
  z.ZodEffects<ZOD_SCHEMA, TransformedValue<SCHEMA>, z.input<ZOD_SCHEMA>>
>

/**
 * Transform a Zod schema to map attribute keys to their saved names.
 */
export const withAttributeNameEncoding = (
  schema: MapSchema | ItemSchema,
  { transform }: ZodParserOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  transform === false ||
  Object.values(schema.attributes).every(attribute => attribute.props.savedAs === undefined)
    ? zodSchema
    : zodSchema.transform(compileAttributeNameEncoder(schema))

/**
 * Build an encoder mapping attribute keys to their saved names.
 */
export const compileAttributeNameEncoder =
  (schema: MapSchema | ItemSchema) =>
  (decoded: unknown): Record<string, unknown> => {
    const encoded: Record<string, unknown> = {}

    for (const [attrName, attribute] of Object.entries(schema.attributes)) {
      const savedAs = attribute.props.savedAs ?? attrName
      encoded[savedAs] = (decoded as Record<string, unknown>)[attrName]
    }

    return encoded
  }
