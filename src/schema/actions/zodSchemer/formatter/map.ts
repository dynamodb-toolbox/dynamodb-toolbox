import { z } from 'zod'

import type { MapSchema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { OptionalWrapper } from './utils.js'
import { optionalWrapper } from './utils.js'

export type MapZodFormatter<
  SCHEMA extends MapSchema,
  OPTIONS extends ZodFormatterOptions
> = MapSchema extends SCHEMA
  ? z.AnyZodObject
  : OptionalWrapper<
      SCHEMA,
      OPTIONS,
      z.ZodObject<
        {
          [KEY in OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>]: SchemaZodFormatter<
            SCHEMA['attributes'][KEY],
            Overwrite<OPTIONS, { defined: false }>
          >
        },
        'strip'
      >
    >

export const mapZodFormatter = (schema: MapSchema, options: ZodFormatterOptions): z.ZodTypeAny => {
  const displayedAttrEntries = Object.entries(schema.attributes).filter(
    ([, attr]) => !attr.props.hidden
  )

  return optionalWrapper(
    schema,
    options,
    z.object(
      Object.fromEntries(
        displayedAttrEntries.map(([attributeName, attribute]) => [
          attributeName,
          schemaZodFormatter(attribute, { ...options, defined: true })
        ])
      )
    )
  )
}
