import { z } from 'zod'

import type { ItemSchema, MapSchema, Schema, TransformedValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/transformer.js'

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
> = OPTIONS extends { partial: true; defined?: false }
  ? z.ZodOptional<ZOD_SCHEMA>
  : SCHEMA['props'] extends { required: 'never' }
    ? z.ZodOptional<ZOD_SCHEMA>
    : ZOD_SCHEMA

export const withOptional = (
  schema: Schema,
  { partial = false, defined = false }: ZodFormatterOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  (partial && !defined) || schema.props.required === 'never' ? z.optional(zodSchema) : zodSchema

export type WithTransform<
  SCHEMA extends Schema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = OPTIONS extends { transform: false }
  ? ZOD_SCHEMA
  : SCHEMA['props'] extends { transform: Transformer }
    ? z.ZodEffects<ZOD_SCHEMA, z.output<ZOD_SCHEMA>, TransformedValue<SCHEMA>>
    : ZOD_SCHEMA

export const withTransform = (
  schema: Extract<Schema, { props: { transform?: unknown } }>,
  { transform = true }: ZodFormatterOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  transform && schema.props.transform !== undefined
    ? z.preprocess((schema.props.transform as Transformer).decode, zodSchema)
    : zodSchema

type RenamedAttributes<SCHEMA extends MapSchema | ItemSchema> = {
  [KEY in keyof SCHEMA['attributes']]: SCHEMA['attributes'][KEY]['props'] extends {
    savedAs: string
  }
    ? KEY
    : never
}[keyof SCHEMA['attributes']]

export type WithRenaming<
  SCHEMA extends MapSchema | ItemSchema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = OPTIONS extends { transform: false }
  ? ZOD_SCHEMA
  : [RenamedAttributes<SCHEMA>] extends [never]
    ? ZOD_SCHEMA
    : z.ZodEffects<ZOD_SCHEMA, z.output<ZOD_SCHEMA>, TransformedValue<SCHEMA>>

export const compileRenamer =
  (schema: MapSchema | ItemSchema) =>
  (encoded: unknown): Record<string, unknown> => {
    const renamedValue: Record<string, unknown> = {}

    for (const [attrName, attribute] of Object.entries(schema.attributes)) {
      const savedAs = attribute.props.savedAs ?? attrName
      renamedValue[attrName] = (encoded as Record<string, unknown>)[savedAs]
    }

    return renamedValue
  }

export const withRenaming = (
  schema: MapSchema | ItemSchema,
  { transform = true }: ZodFormatterOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  transform &&
  Object.values(schema.attributes).some(attribute => attribute.props.savedAs !== undefined)
    ? z.preprocess(compileRenamer(schema), zodSchema)
    : zodSchema
