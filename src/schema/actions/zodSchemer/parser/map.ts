import { z } from 'zod'

import type { MapSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'
import type { SelectKeys } from '~/types/selectKeys.js'

import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithAttributeNameEncoding, WithDefault, WithOptional } from './utils.js'
import { withAttributeNameEncoding, withDefault, withOptional } from './utils.js'

export type MapZodParser<
  SCHEMA extends MapSchema,
  OPTIONS extends ZodParserOptions = {}
> = MapSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithAttributeNameEncoding<
      SCHEMA,
      OPTIONS,
      WithDefault<
        SCHEMA,
        OPTIONS,
        WithOptional<
          SCHEMA,
          OPTIONS,
          z.ZodObject<
            {
              [KEY in OPTIONS extends { mode: 'key' }
                ? SelectKeys<SCHEMA['attributes'], { props: { key: true } }>
                : keyof SCHEMA['attributes']]: SchemaZodParser<
                SCHEMA['attributes'][KEY],
                Overwrite<OPTIONS, { defined: false }>
              >
            },
            'strip'
          >
        >
      >
    >

export const mapZodParser = (schema: MapSchema, options: ZodParserOptions = {}): z.ZodTypeAny => {
  const { mode = 'put' } = options

  const displayedAttrEntries =
    mode === 'key'
      ? Object.entries(schema.attributes).filter(([, { props }]) => props.key)
      : Object.entries(schema.attributes)

  return withAttributeNameEncoding(
    schema,
    options,
    withDefault(
      schema,
      options,
      withOptional(
        schema,
        options,
        z.object(
          Object.fromEntries(
            displayedAttrEntries.map(([attributeName, attribute]) => [
              attributeName,
              schemaZodParser(attribute, { ...options, defined: false })
            ])
          )
        )
      )
    )
  )
}
