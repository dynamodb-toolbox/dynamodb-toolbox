import { z } from 'zod'

import type { RecordSchema } from '~/schema/index.js'
import type { Cast } from '~/types/cast.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { OptionalWrapper } from './utils.js'
import { optionalWrapper } from './utils.js'

export type RecordZodFormatter<
  SCHEMA extends RecordSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = RecordSchema extends SCHEMA
  ? z.ZodTypeAny
  : OptionalWrapper<
      SCHEMA,
      OPTIONS,
      /**
       * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
       */
      SCHEMA extends { keys: { props: { enum: string[] } }; props: { partial?: false } }
        ? z.ZodObject<
            {
              [KEY in SCHEMA['keys']['props']['enum'][number]]: SchemaZodFormatter<
                SCHEMA['elements'],
                Overwrite<OPTIONS, { defined: false }>
              >
            },
            'strip'
          >
        : z.ZodRecord<
            Cast<
              SchemaZodFormatter<SCHEMA['keys'], Overwrite<OPTIONS, { defined: true }>>,
              z.KeySchema
            >,
            SchemaZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>
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
    zodFormatter = z.object(
      Object.fromEntries(schema.keys.props.enum.map(key => [key, elementsFormatter]))
    )
  } else {
    zodFormatter = z.record(
      schemaZodFormatter(schema.keys, { ...options, defined: true }),
      schemaZodFormatter(schema.elements, { ...options, defined: true })
    )
  }

  return optionalWrapper(schema, options, zodFormatter)
}
