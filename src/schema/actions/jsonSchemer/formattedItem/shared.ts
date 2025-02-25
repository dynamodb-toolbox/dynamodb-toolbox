import type { MapAttribute, Never } from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { OmitKeys } from '~/types/omitKeys.js'

export type RequiredProperties<SCHEMA extends Schema | MapAttribute> = Schema extends SCHEMA
  ? string
  : MapAttribute extends SCHEMA
    ? string
    : {
        [KEY in OmitKeys<
          SCHEMA['attributes'],
          { state: { hidden: true } }
        >]: SCHEMA['attributes'][KEY]['state'] extends { required: Never } ? never : KEY
      }[OmitKeys<SCHEMA['attributes'], { state: { hidden: true } }>]
