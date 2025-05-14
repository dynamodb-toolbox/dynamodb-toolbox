import { z } from 'zod'

import type { MapSchema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithOptional, WithRenaming } from './utils.js'
import { withOptional, withRenaming } from './utils.js'

export type MapZodFormatter<
  SCHEMA extends MapSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithRenaming<
  SCHEMA,
  OPTIONS,
  WithOptional<
    SCHEMA,
    OPTIONS,
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

export const mapZodFormatter = (
  schema: MapSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny => {
  const { format = true } = options

  const displayedAttrEntries = format
    ? Object.entries(schema.attributes).filter(([, { props }]) => !props.hidden)
    : Object.entries(schema.attributes)

  return withRenaming(
    schema,
    options,
    withOptional(
      schema,
      options,
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
}
