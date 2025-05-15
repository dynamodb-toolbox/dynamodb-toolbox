import { z } from 'zod'

import type { ItemSchema, MapSchema, Schema, TransformedValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/transformer.js'

import type { SavedAsAttributes } from '../utils.js'
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

export type WithOptional<
  SCHEMA extends Schema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = OPTIONS extends { defined: true }
  ? ZOD_SCHEMA
  : OPTIONS extends { partial: true }
    ? z.ZodOptional<ZOD_SCHEMA>
    : SCHEMA['props'] extends { required: 'never' }
      ? z.ZodOptional<ZOD_SCHEMA>
      : ZOD_SCHEMA

export const withOptional = (
  schema: Schema,
  { partial, defined }: ZodFormatterOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  defined === true
    ? zodSchema
    : partial === true || schema.props.required === 'never'
      ? z.optional(zodSchema)
      : zodSchema

export type WithDecoding<
  SCHEMA extends Schema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = OPTIONS extends { transform: false }
  ? ZOD_SCHEMA
  : SCHEMA['props'] extends { transform: Transformer }
    ? z.ZodEffects<ZOD_SCHEMA, z.output<ZOD_SCHEMA>, TransformedValue<SCHEMA>>
    : ZOD_SCHEMA

export const withDecoding = (
  schema: Extract<Schema, { props: { transform?: unknown } }>,
  { transform }: ZodFormatterOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  transform === false
    ? zodSchema
    : schema.props.transform !== undefined
      ? z.preprocess(encoded => (schema.props.transform as Transformer).decode(encoded), zodSchema)
      : zodSchema

export type WithAttributeNameDecoding<
  SCHEMA extends MapSchema | ItemSchema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = OPTIONS extends { transform: false }
  ? ZOD_SCHEMA
  : [SavedAsAttributes<SCHEMA>] extends [never]
    ? ZOD_SCHEMA
    : z.ZodEffects<ZOD_SCHEMA, z.output<ZOD_SCHEMA>, TransformedValue<SCHEMA>>

export const withAttributeNameDecoding = (
  schema: MapSchema | ItemSchema,
  { transform }: ZodFormatterOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  transform === false
    ? zodSchema
    : Object.values(schema.attributes).every(attribute => attribute.props.savedAs === undefined)
      ? zodSchema
      : z.preprocess(compileAttributeNameDecoder(schema), zodSchema)

export const compileAttributeNameDecoder =
  (schema: MapSchema | ItemSchema) =>
  (encoded: unknown): Record<string, unknown> => {
    const decoded: Record<string, unknown> = {}

    for (const [attrName, attribute] of Object.entries(schema.attributes)) {
      const savedAs = attribute.props.savedAs ?? attrName
      decoded[attrName] = (encoded as Record<string, unknown>)[savedAs]
    }

    return decoded
  }
