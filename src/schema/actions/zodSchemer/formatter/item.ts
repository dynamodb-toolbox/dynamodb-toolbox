import { z } from 'zod'

import type { ItemSchema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'

export type ItemZodFormatter<
  SCHEMA extends ItemSchema,
  OPTIONS extends ZodFormatterOptions
> = ItemSchema extends SCHEMA
  ? z.AnyZodObject
  : z.ZodObject<
      {
        [KEY in OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>]: SchemaZodFormatter<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      'strip'
    >

export const itemZodFormatter = (
  schema: ItemSchema,
  options: ZodFormatterOptions
): z.ZodTypeAny => {
  const displayedAttrEntries = Object.entries(schema.attributes).filter(
    ([, attr]) => !attr.props.hidden
  )

  return z.object(
    Object.fromEntries(
      displayedAttrEntries.map(([attributeName, attribute]) => [
        attributeName,
        schemaZodFormatter(attribute, { ...options, defined: false })
      ])
    )
  )
}
