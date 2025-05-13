import { z } from 'zod'

import type { ItemSchema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'

import type { ZodFormatter } from './schema.js'
import { getZodFormatter } from './schema.js'

export type ItemZodFormatter<SCHEMA extends ItemSchema> = z.ZodObject<
  {
    [KEY in OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>]: ZodFormatter<
      SCHEMA['attributes'][KEY]
    >
  },
  'strip'
>

export const getItemZodFormatter = (schema: ItemSchema): z.ZodTypeAny => {
  const displayedAttrEntries = Object.entries(schema.attributes).filter(
    ([, attr]) => !attr.props.hidden
  )

  return z.object(
    Object.fromEntries(
      displayedAttrEntries.map(([attributeName, attribute]) => [
        attributeName,
        getZodFormatter(attribute)
      ])
    )
  )
}
