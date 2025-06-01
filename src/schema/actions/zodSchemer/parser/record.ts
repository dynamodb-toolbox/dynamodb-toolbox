import { z } from 'zod'

import type { RecordSchema, TransformedValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/transformer.js'
import type { Cast } from '~/types/cast.js'
import type { Extends, If } from '~/types/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithOptional } from './utils.js'
import { withDefault, withOptional } from './utils.js'

type WithEncodedKeys<
  SCHEMA extends RecordSchema,
  OPTIONS extends ZodParserOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = If<
  Extends<OPTIONS, { transform: false }>,
  ZOD_SCHEMA,
  If<
    Extends<SCHEMA['keys']['props'], { transform: Transformer }>,
    z.ZodEffects<ZOD_SCHEMA, TransformedValue<SCHEMA>, z.input<ZOD_SCHEMA>>,
    ZOD_SCHEMA
  >
>

const withEncodedKeys = (
  schema: RecordSchema,
  { transform }: ZodParserOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  transform === false
    ? zodSchema
    : schema.keys.props.transform !== undefined
      ? zodSchema.transform(compileKeysEncoder(schema))
      : zodSchema

export const compileKeysEncoder =
  (schema: RecordSchema) =>
  (decoded: unknown): Record<string, unknown> => {
    const encoded: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(decoded as Record<string, unknown>)) {
      const encodedKey = (schema.keys.props.transform as Transformer).encode(key)
      encoded[encodedKey] = value
    }

    return encoded
  }

export type RecordZodParser<
  SCHEMA extends RecordSchema,
  OPTIONS extends ZodParserOptions = {}
> = RecordSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithDefault<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        WithValidate<
          SCHEMA,
          /**
           * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
           */
          SCHEMA extends { keys: { props: { enum: string[] } }; props: { partial?: false } }
            ? WithEncodedKeys<
                SCHEMA,
                OPTIONS,
                z.ZodObject<
                  {
                    [KEY in SCHEMA['keys']['props']['enum'][number]]: SchemaZodParser<
                      SCHEMA['elements'],
                      Overwrite<OPTIONS, { defined: false }>
                    >
                  },
                  'strip'
                >
              >
            : z.ZodRecord<
                Cast<
                  SchemaZodParser<SCHEMA['keys'], Overwrite<OPTIONS, { defined: true }>>,
                  z.KeySchema
                >,
                SchemaZodParser<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>
              >
        >
      >
    >

export const recordZodParser = (
  schema: RecordSchema,
  options: ZodParserOptions = {}
): z.ZodTypeAny => {
  let zodFormatter: z.ZodTypeAny

  if (schema.keys.props.enum !== undefined && schema.props.partial !== true) {
    const elementsFormatter = schemaZodParser(schema.elements, { ...options, defined: false })

    /**
     * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
     */
    zodFormatter = withEncodedKeys(
      schema,
      options,
      z.object(Object.fromEntries(schema.keys.props.enum.map(key => [key, elementsFormatter])))
    )
  } else {
    zodFormatter = z.record(
      schemaZodParser(schema.keys, { ...options, defined: true }),
      schemaZodParser(schema.elements, { ...options, defined: true })
    )
  }

  return withDefault(
    schema,
    options,
    withOptional(schema, options, withValidate(schema, zodFormatter))
  )
}
