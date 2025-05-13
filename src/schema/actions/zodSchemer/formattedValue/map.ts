import { z } from 'zod'

import type { MapSchema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'

import type { FormattedValueZodSchema } from './schema.js'
import { getFormattedValueZodSchema } from './schema.js'
import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedMapZodSchema<SCHEMA extends MapSchema> = AddOptional<
  SCHEMA,
  z.ZodObject<
    {
      [KEY in OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>]: FormattedValueZodSchema<
        SCHEMA['attributes'][KEY]
      >
    },
    'strip'
  >
>

export const getFormattedMapZodSchema = (schema: MapSchema): z.ZodTypeAny => {
  const displayedAttrEntries = Object.entries(schema.attributes).filter(
    ([, attr]) => !attr.props.hidden
  )

  return addOptional(
    schema,
    z.object(
      Object.fromEntries(
        displayedAttrEntries.map(([attributeName, attribute]) => [
          attributeName,
          getFormattedValueZodSchema(attribute)
        ])
      )
    )
  )
}
