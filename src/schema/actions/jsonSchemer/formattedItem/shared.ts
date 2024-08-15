import type { Always, AtLeastOnce, MapAttribute } from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { SelectKeys } from '~/types/selectKeys.js'

export type RequiredProperties<SCHEMA extends Schema | MapAttribute> = Schema extends SCHEMA
  ? string
  : MapAttribute extends SCHEMA
    ? string
    : {
        [KEY in SelectKeys<
          SCHEMA['attributes'],
          { hidden: false }
        >]: SCHEMA['attributes'][KEY] extends {
          required: AtLeastOnce | Always
        }
          ? KEY
          : never
      }[SelectKeys<SCHEMA['attributes'], { hidden: false }>]
