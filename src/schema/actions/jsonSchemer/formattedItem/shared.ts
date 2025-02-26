import type { MapSchema, Never } from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'

export type RequiredProperties<SCHEMA extends Schema | MapSchema> = Schema extends SCHEMA
  ? string
  : MapSchema extends SCHEMA
    ? string
    : {
        [KEY in OmitKeys<
          SCHEMA['attributes'],
          { props: { hidden: true } }
        >]: SCHEMA['attributes'][KEY]['props'] extends { required: Never } ? never : KEY
      }[OmitKeys<SCHEMA['attributes'], { props: { hidden: true } }>]
