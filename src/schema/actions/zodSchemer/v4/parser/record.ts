import { z } from 'zod/v4'

import type { RecordSchema, TransformedValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/transformer.js'
import type { Cast } from '~/types/cast.js'
import type { Extends, If } from '~/types/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithOptional } from './utils.js'
import { withDefault, withOptional } from './utils.js'

type WithEncodedKeys<
  SCHEMA extends RecordSchema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodType
> = If<
  Extends<OPTIONS, { transform: false }>,
  ZOD_SCHEMA,
  If<
    Extends<SCHEMA['keys']['props'], { transform: Transformer }>,
    z.ZodPipe<ZOD_SCHEMA, z.ZodTransform<TransformedValue<SCHEMA>, z.output<ZOD_SCHEMA>>>,
    ZOD_SCHEMA
  >
>

const withEncodedKeys = (
  schema: RecordSchema,
  zodSchema: z.ZodType,
  { transform }: ZodParserOptions
): z.ZodType => {
  if (transform === false || schema.keys.props.transform === undefined) {
    return zodSchema
  }

  return zodSchema.transform(compileKeysEncoder(schema))
}

/**
 * Build an encoder mapping record keys to their saved form.
 */
export const compileKeysEncoder =
  (schema: RecordSchema) =>
  (decoded: unknown): Record<string, unknown> => {
    const encoded: Record<string, unknown> = {}

    // Every schema type declares `transform` as `unknown`, so reading it as a transformer is a cast
    const transformer = schema.keys.props.transform as Transformer

    for (const [key, value] of Object.entries(decoded as Record<string, unknown>)) {
      encoded[transformer.encode(key)] = value
    }

    return encoded
  }

/**
 * Zod schema validating an input `record` value.
 */
export type RecordZodParser<
  SCHEMA extends RecordSchema,
  OPTIONS extends ZodParserOptions = {}
> = RecordSchema extends SCHEMA
  ? z.ZodType
  : WithDefault<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        /**
         * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
         */
        SCHEMA extends { keys: { props: { enum: string[] } }; props: { partial?: false } }
          ? WithEncodedKeys<
              SCHEMA,
              OPTIONS,
              z.ZodObject<{
                [KEY in SCHEMA['keys']['props']['enum'][number]]: SchemaZodParser<
                  SCHEMA['elements'],
                  Overwrite<OPTIONS, { defined: false }>
                >
              }>
            >
          : z.ZodRecord<
              Cast<
                SchemaZodParser<SCHEMA['keys'], Overwrite<OPTIONS, { defined: true }>>,
                z.core.$ZodRecordKey
              >,
              SchemaZodParser<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>
            >
      >
    >

/**
 * Build a Zod schema validating an input `record` value.
 */
export const recordZodParser = (
  schema: RecordSchema,
  options: ZodParserOptions = {}
): z.ZodType => {
  let zodParser: z.ZodType

  if (schema.keys.props.enum !== undefined && schema.props.partial !== true) {
    const elementsParser = schemaZodParser(schema.elements, { ...options, defined: false })

    /**
     * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
     */
    zodParser = withEncodedKeys(
      schema,
      z.object(Object.fromEntries(schema.keys.props.enum.map(key => [key, elementsParser]))),
      options
    )
  } else {
    zodParser = z.record(
      // A record key is a string, enum or literal schema, which the loose `z.ZodType` of the recursion does not say
      schemaZodParser(schema.keys, { ...options, defined: true }) as z.core.$ZodRecordKey,
      schemaZodParser(schema.elements, { ...options, defined: true })
    )
  }

  return withMeta(
    schema,
    withDefault(schema, withOptional(schema, withValidate(schema, zodParser), options), options)
  )
}
