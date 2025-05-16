import { z } from 'zod'

import type { ItemSchema, MapSchema, Schema, TransformedValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/transformer.js'
import type { Extends, If, Or } from '~/types/index.js'

import type { SavedAsAttributes } from '../utils.js'
import type { ZodParserOptions } from './types.js'

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

export type WithOptional<
  SCHEMA extends Schema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = If<
  Extends<OPTIONS, { defined: true }>,
  ZOD_SCHEMA,
  If<Extends<SCHEMA['props'], { required: 'never' }>, z.ZodOptional<ZOD_SCHEMA>, ZOD_SCHEMA>
>

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

export type WithAttributeNameEncoding<
  SCHEMA extends MapSchema | ItemSchema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = If<
  Or<Extends<OPTIONS, { transform: false }>, Extends<[SavedAsAttributes<SCHEMA>], [never]>>,
  ZOD_SCHEMA,
  z.ZodEffects<ZOD_SCHEMA, TransformedValue<SCHEMA>, z.input<ZOD_SCHEMA>>
>

export const withAttributeNameEncoding = (
  schema: MapSchema | ItemSchema,
  { transform }: ZodParserOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  transform === false ||
  Object.values(schema.attributes).every(attribute => attribute.props.savedAs === undefined)
    ? zodSchema
    : zodSchema.transform(compileAttributeNameEncoder(schema))

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
