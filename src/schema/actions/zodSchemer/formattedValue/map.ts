import { z } from 'zod'

import type { MapSchema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'

import type { ZodFormatter } from './schema.js'
import { getZodFormatter } from './schema.js'
import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type MapZodFormatter<SCHEMA extends MapSchema> = AddOptional<
  SCHEMA,
  z.ZodObject<
    {
      [KEY in OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>]: ZodFormatter<
        SCHEMA['attributes'][KEY]
      >
    },
    'strip'
  >
>

export const getMapZodFormatter = (schema: MapSchema): z.ZodTypeAny => {
  const displayedAttrEntries = Object.entries(schema.attributes).filter(
    ([, attr]) => !attr.props.hidden
  )

  return addOptional(
    schema,
    z.object(
      Object.fromEntries(
        displayedAttrEntries.map(([attributeName, attribute]) => [
          attributeName,
          getZodFormatter(attribute)
        ])
      )
    )
  )
}
