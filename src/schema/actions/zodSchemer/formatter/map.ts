import { z } from 'zod'

import type { MapSchema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithAttributeNameDecoding, WithOptional } from './utils.js'
import { withAttributeNameDecoding, withOptional } from './utils.js'

export type MapZodFormatter<
  SCHEMA extends MapSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = MapSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithAttributeNameDecoding<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        WithValidate<
          SCHEMA,
          z.ZodObject<
            {
              [KEY in OPTIONS extends { format: false }
                ? keyof SCHEMA['attributes']
                : OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>]: SchemaZodFormatter<
                SCHEMA['attributes'][KEY],
                Overwrite<OPTIONS, { defined: false }>
              >
            },
            'strip'
          >
        >
      >
    >

export const mapZodFormatter = (
  schema: MapSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny => {
  const { format = true } = options

  const displayedAttrEntries = format
    ? Object.entries(schema.attributes).filter(([, { props }]) => !props.hidden)
    : Object.entries(schema.attributes)

  return withAttributeNameDecoding(
    schema,
    options,
    withOptional(
      schema,
      options,
      withValidate(
        schema,
        z.object(
          Object.fromEntries(
            displayedAttrEntries.map(([attributeName, attribute]) => [
              attributeName,
              schemaZodFormatter(attribute, { ...options, defined: false })
            ])
          )
        )
      )
    )
  )
}
