import { z } from 'zod'

import type { ItemSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'
import type { SelectKeys } from '~/types/selectKeys.js'

import { withDescribe } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithAttributeNameEncoding } from './utils.js'
import { withAttributeNameEncoding } from './utils.js'

/**
 * Zod schema validating an input `item` value.
 */
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
          [KEY in OPTIONS extends { mode: 'key' }
            ? SelectKeys<SCHEMA['attributes'], { props: { key: true } }>
            : keyof SCHEMA['attributes']]: SchemaZodParser<
            SCHEMA['attributes'][KEY],
            Overwrite<OPTIONS, { defined: false }>
          >
        },
        SCHEMA['props'] extends { strict: true } ? 'strict' : 'strip'
      >
    >

/**
 * Build a Zod schema validating an input `item` value.
 */
export const itemZodParser = <SCHEMA extends ItemSchema, OPTIONS extends ZodParserOptions = {}>(
  schema: SCHEMA,
  options: OPTIONS = {} as OPTIONS
): ItemZodParser<SCHEMA, OPTIONS> => {
  const { mode = 'put' } = options

  const displayedAttrEntries =
    mode === 'key'
      ? Object.entries(schema.attributes).filter(([, { props }]) => props.key)
      : Object.entries(schema.attributes)

  const zodObject = z.object(
    Object.fromEntries(
      displayedAttrEntries.map(([attributeName, attribute]) => [
        attributeName,
        schemaZodParser(attribute, { ...options, defined: false })
      ])
    )
  )

  return withDescribe(
    schema,
    withAttributeNameEncoding(schema, options, schema.props.strict ? zodObject.strict() : zodObject)
  ) as ItemZodParser<SCHEMA, OPTIONS>
}
