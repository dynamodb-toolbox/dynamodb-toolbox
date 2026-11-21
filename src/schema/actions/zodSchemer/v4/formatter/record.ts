import { z } from 'zod/v4'

import type { RecordSchema, TransformedValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/transformer.js'
import type { Cast } from '~/types/cast.js'
import type { Extends, If } from '~/types/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithOptional } from './utils.js'
import { withOptional } from './utils.js'

type WithDecodedKeys<
  SCHEMA extends RecordSchema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodType
> = If<
  Extends<OPTIONS, { transform: false }>,
  ZOD_SCHEMA,
  If<
    Extends<SCHEMA['keys']['props'], { transform: Transformer }>,
    z.ZodPreprocess<ZOD_SCHEMA, TransformedValue<SCHEMA>>,
    ZOD_SCHEMA
  >
>

const withDecodedKeys = (
  schema: RecordSchema,
  zodSchema: z.ZodType,
  { transform }: ZodFormatterOptions
): z.ZodType => {
  if (transform === false || schema.keys.props.transform === undefined) {
    return zodSchema
  }

  return z.preprocess(compileKeysDecoder(schema), zodSchema)
}

/**
 * Build a decoder mapping saved record keys back to their app form.
 */
export const compileKeysDecoder =
  (schema: RecordSchema) =>
  (encoded: unknown): Record<string, unknown> => {
    const decoded: Record<string, unknown> = {}

    // Every schema type declares `transform` as `unknown`, so reading it as a transformer is a cast
    const transformer = schema.keys.props.transform as Transformer

    // The saved value is a record, which zod types as `unknown` at the call site
    for (const [key, value] of Object.entries(encoded as Record<string, unknown>)) {
      decoded[transformer.decode(key)] = value
    }

    return decoded
  }

/**
 * Zod schema validating a formatted `record` value.
 */
export type RecordZodFormatter<
  SCHEMA extends RecordSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = RecordSchema extends SCHEMA
  ? z.ZodType
  : WithOptional<
      SCHEMA,
      OPTIONS,
      /**
       * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
       */
      SCHEMA extends { keys: { props: { enum: string[] } }; props: { partial?: false } }
        ? WithDecodedKeys<
            SCHEMA,
            OPTIONS,
            z.ZodObject<{
              [KEY in SCHEMA['keys']['props']['enum'][number]]: SchemaZodFormatter<
                SCHEMA['elements'],
                Overwrite<OPTIONS, { defined: false }>
              >
            }>
          >
        : z.ZodRecord<
            Cast<
              SchemaZodFormatter<SCHEMA['keys'], Overwrite<OPTIONS, { defined: true }>>,
              z.core.$ZodRecordKey
            >,
            SchemaZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>
          >
    >

/**
 * Build a Zod schema validating a formatted `record` value.
 */
export const recordZodFormatter = (
  schema: RecordSchema,
  options: ZodFormatterOptions = {}
): z.ZodType => {
  let zodFormatter: z.ZodType

  if (schema.keys.props.enum !== undefined && schema.props.partial !== true) {
    const elementsFormatter = schemaZodFormatter(schema.elements, { ...options, defined: false })

    /**
     * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
     */
    zodFormatter = withDecodedKeys(
      schema,
      z.object(Object.fromEntries(schema.keys.props.enum.map(key => [key, elementsFormatter]))),
      options
    )
  } else {
    zodFormatter = z.record(
      // A record key is a string, enum or literal schema, which the loose `z.ZodType` of the recursion does not say
      schemaZodFormatter(schema.keys, { ...options, defined: true }) as z.core.$ZodRecordKey,
      schemaZodFormatter(schema.elements, { ...options, defined: true })
    )
  }

  return withMeta(schema, withOptional(schema, withValidate(schema, zodFormatter), options))
}
