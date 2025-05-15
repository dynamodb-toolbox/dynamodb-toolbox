import { z } from 'zod'

import type { ItemSchema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithAttributeNameEncoding } from './utils.js'
import { withAttributeNameEncoding } from './utils.js'

export type ItemZodParser<
  SCHEMA extends ItemSchema,
  OPTIONS extends ZodParserOptions = {}
> = ItemSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithAttributeNameEncoding<
      SCHEMA,
      OPTIONS,
      z.ZodObject<
        {
          [KEY in OPTIONS extends { format: false }
            ? keyof SCHEMA['attributes']
            : OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>]: SchemaZodParser<
            SCHEMA['attributes'][KEY],
            Overwrite<OPTIONS, { defined: false }>
          >
        },
        'strip'
      >
    >

export const itemZodParser = <SCHEMA extends ItemSchema, OPTIONS extends ZodParserOptions = {}>(
  schema: SCHEMA,
  options: OPTIONS = {} as OPTIONS
): ItemZodParser<SCHEMA, OPTIONS> =>
  withAttributeNameEncoding(
    schema,
    options,
    z.object(
      Object.fromEntries(
        Object.entries(schema.attributes).map(([attributeName, attribute]) => [
          attributeName,
          schemaZodParser(attribute, { ...options, defined: false })
        ])
      )
    )
  ) as ItemZodParser<SCHEMA, OPTIONS>
