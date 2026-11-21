import { z } from 'zod/v4'

import type { MapSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'
import type { SelectKeys } from '~/types/selectKeys.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithAttributeNameEncoding, WithDefault, WithOptional } from './utils.js'
import { withAttributeNameEncoding, withDefault, withOptional } from './utils.js'

/**
 * Zod schema validating an input `map` value.
 *
 * The `strict` prop has no counterpart in the Zod schema: zod v4 types a strict object and a
 * stripped one identically (`$strict` and `$strip` are structurally equal), so it is carried at
 * runtime only.
 */
export type MapZodParser<
  SCHEMA extends MapSchema,
  OPTIONS extends ZodParserOptions = {}
> = MapSchema extends SCHEMA
  ? z.ZodType
  : WithAttributeNameEncoding<
      SCHEMA,
      OPTIONS,
      WithDefault<
        SCHEMA,
        OPTIONS,
        WithOptional<
          SCHEMA,
          OPTIONS,
          z.ZodObject<{
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<SCHEMA['attributes'], { props: { key: true } }>
              : keyof SCHEMA['attributes']]: SchemaZodParser<
              SCHEMA['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          }>
        >
      >
    >

/**
 * Build a Zod schema validating an input `map` value.
 */
export const mapZodParser = (schema: MapSchema, options: ZodParserOptions = {}): z.ZodType => {
  const { mode = 'put' } = options

  const displayedAttrEntries =
    mode === 'key'
      ? Object.entries(schema.attributes).filter(([, { props }]) => props.key)
      : Object.entries(schema.attributes)

  const zodShape = Object.fromEntries(
    displayedAttrEntries.map(([attributeName, attribute]) => [
      attributeName,
      schemaZodParser(attribute, { ...options, defined: false })
    ])
  )

  const zodObject = schema.props.strict ? z.strictObject(zodShape) : z.object(zodShape)

  return withMeta(
    schema,
    withAttributeNameEncoding(
      schema,
      withDefault(schema, withOptional(schema, withValidate(schema, zodObject), options), options),
      options
    )
  )
}
