import type { Schema } from '../interface'
import type {
  Attribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  ComputedDefault
} from '../attributes'

/**
 * Wether an Item or Attribute has a default value that needs to be computed (recursive)
 *
 * @param Schema Item | Attribute
 * @return Boolean
 */
export type HasComputedDefaults<SCHEMA extends Schema | Attribute> = SCHEMA extends {
  default: ComputedDefault
}
  ? true
  : SCHEMA extends SetAttribute | ListAttribute
  ? HasComputedDefaults<SCHEMA['elements']>
  : SCHEMA extends MapAttribute | Schema
  ? true extends {
      [ATTRIBUTE_NAME in keyof SCHEMA['attributes']]: HasComputedDefaults<
        SCHEMA['attributes'][ATTRIBUTE_NAME]
      >
    }[keyof SCHEMA['attributes']]
    ? true
    : false
  : false
