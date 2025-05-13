import { z } from 'zod'

import type { MapSchema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'

import type { FormattedValueZodSchema } from './schema.js'
import { getFormattedValueZodSchema } from './schema.js'

export type FormattedMapZodSchema<SCHEMA extends MapSchema> = z.ZodObject<
  {
    [KEY in OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>]: FormattedValueZodSchema<
      SCHEMA['attributes'][KEY]
    >
  },
  'strip'
>

export const getFormattedMapZodSchema = (schema: MapSchema): z.ZodTypeAny => {
  const displayedAttrEntries = Object.entries(schema.attributes).filter(
    ([, attr]) => !attr.props.hidden
  )

  return z.object(
    Object.fromEntries(
      displayedAttrEntries.map(([attributeName, attribute]) => [
        attributeName,
        getFormattedValueZodSchema(attribute)
      ])
    )
  )
}
