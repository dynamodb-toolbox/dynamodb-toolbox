import { z } from 'zod'

import type { RecordSchema, TransformedValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/transformer.js'
import type { Cast } from '~/types/cast.js'
import type { Extends, If } from '~/types/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithOptional } from './utils.js'
import { withOptional } from './utils.js'

type WithDecodedKeys<
  SCHEMA extends RecordSchema,
  OPTIONS extends ZodFormatterOptions,
  ZOD_SCHEMA extends z.ZodTypeAny
> = If<
  Extends<OPTIONS, { transform: false }>,
  ZOD_SCHEMA,
  If<
    Extends<SCHEMA['keys']['props'], { transform: Transformer }>,
    z.ZodEffects<ZOD_SCHEMA, z.output<ZOD_SCHEMA>, TransformedValue<SCHEMA>>,
    ZOD_SCHEMA
  >
>

const withDecodedKeys = (
  schema: RecordSchema,
  { transform }: ZodFormatterOptions,
  zodSchema: z.ZodTypeAny
): z.ZodTypeAny =>
  transform === false
    ? zodSchema
    : schema.keys.props.transform !== undefined
      ? z.preprocess(compileKeysDecoder(schema), zodSchema)
      : zodSchema

export const compileKeysDecoder =
  (schema: RecordSchema) =>
  (encoded: unknown): Record<string, unknown> => {
    const decoded: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(encoded as Record<string, unknown>)) {
      const decodedKey = (schema.keys.props.transform as Transformer).decode(key)
      decoded[decodedKey] = value
    }

    return decoded
  }

export type RecordZodFormatter<
  SCHEMA extends RecordSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = RecordSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithOptional<
      SCHEMA,
      OPTIONS,
      WithValidate<
        SCHEMA,
        /**
         * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
         */
        SCHEMA extends { keys: { props: { enum: string[] } }; props: { partial?: false } }
          ? WithDecodedKeys<
              SCHEMA,
              OPTIONS,
              z.ZodObject<
                {
                  [KEY in SCHEMA['keys']['props']['enum'][number]]: SchemaZodFormatter<
                    SCHEMA['elements'],
                    Overwrite<OPTIONS, { defined: false }>
                  >
                },
                'strip'
              >
            >
          : z.ZodRecord<
              Cast<
                SchemaZodFormatter<SCHEMA['keys'], Overwrite<OPTIONS, { defined: true }>>,
                z.KeySchema
              >,
              SchemaZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>
            >
      >
    >

export const recordZodFormatter = (
  schema: RecordSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny => {
  let zodFormatter: z.ZodTypeAny

  if (schema.keys.props.enum !== undefined && schema.props.partial !== true) {
    const elementsFormatter = schemaZodFormatter(schema.elements, { ...options, defined: false })

    /**
     * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
     */
    zodFormatter = withDecodedKeys(
      schema,
      options,
      z.object(Object.fromEntries(schema.keys.props.enum.map(key => [key, elementsFormatter])))
    )
  } else {
    zodFormatter = z.record(
      schemaZodFormatter(schema.keys, { ...options, defined: true }),
      schemaZodFormatter(schema.elements, { ...options, defined: true })
    )
  }

  return withOptional(schema, options, withValidate(schema, zodFormatter))
}
