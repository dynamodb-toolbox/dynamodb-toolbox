import { z } from 'zod/v4'

import type { MapSchema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithAttributeNameDecoding, WithOptional } from './utils.js'
import { withAttributeNameDecoding, withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `map` value.
 */
export type MapZodFormatter<
  SCHEMA extends MapSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = MapSchema extends SCHEMA
  ? z.ZodType
  : WithAttributeNameDecoding<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        z.ZodObject<{
          [
            KEY in OPTIONS extends { format: false }
              ? keyof SCHEMA['attributes']
              : OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>
          ]: SchemaZodFormatter<SCHEMA['attributes'][KEY], Overwrite<OPTIONS, { defined: false }>>
        }>
      >
    >

/**
 * Build a Zod schema validating a formatted `map` value.
 */
export const mapZodFormatter = (
  schema: MapSchema,
  options: ZodFormatterOptions = {}
): z.ZodType => {
  const { format = true } = options

  const displayedAttrEntries = format
    ? Object.entries(schema.attributes).filter(([, { props }]) => !props.hidden)
    : Object.entries(schema.attributes)

  const zodObject = z.object(
    Object.fromEntries(
      displayedAttrEntries.map(([attributeName, attribute]) => [
        attributeName,
        schemaZodFormatter(attribute, { ...options, defined: false })
      ])
    )
  )

  return withMeta(
    schema,
    withAttributeNameDecoding(
      schema,
      withOptional(schema, withValidate(schema, zodObject), options),
      options
    )
  )
}
