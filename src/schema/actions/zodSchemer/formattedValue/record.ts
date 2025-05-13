import { z } from 'zod'

import type { RecordSchema } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'
import { getZodFormatter } from './schema.js'
import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type RecordZodFormatter<SCHEMA extends RecordSchema> = AddOptional<
  SCHEMA,
  /**
   * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
   */
  SCHEMA extends { keys: { props: { enum: string[] } }; props: { partial?: false } }
    ? z.ZodObject<
        {
          [KEY in SCHEMA['keys']['props']['enum'][number]]: ZodFormatter<SCHEMA['elements']>
        },
        'strip'
      >
    : z.ZodRecord<
        ZodFormatter<SCHEMA['keys']> extends z.KeySchema ? ZodFormatter<SCHEMA['keys']> : never,
        ZodFormatter<SCHEMA['elements']>
      >
>

export const getRecordZodFormatter = (schema: RecordSchema): z.ZodTypeAny => {
  let zodFormatter: z.ZodTypeAny

  if (schema.keys.props.enum !== undefined && schema.props.partial !== true) {
    const elementsFormatter = getZodFormatter(schema.elements)

    /**
     * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
     */
    zodFormatter = z.object(
      Object.fromEntries(schema.keys.props.enum.map(key => [key, elementsFormatter]))
    )
  } else {
    zodFormatter = z.record(getZodFormatter(schema.keys), getZodFormatter(schema.elements))
  }

  return addOptional(schema, zodFormatter)
}
