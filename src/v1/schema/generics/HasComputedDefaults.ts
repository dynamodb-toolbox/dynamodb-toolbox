import type { Schema } from '../interface'
import type {
  Attribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  ComputedDefault
} from '../attributes'

/**
 * Wether an Schema or Attribute has a default value that needs to be computed (recursive)
 *
 * @param SCHEMA Schema | Attribute
 * @param VERB "put" | "update"
 * @return Boolean
 */
export type HasComputedDefaults<
  SCHEMA extends Schema | Attribute,
  VERB extends 'put' | 'update'
> = SCHEMA extends {
  // TODO: Use defaults from get/update etc...
  defaults: { [verb in VERB]: ComputedDefault }
}
  ? true
  : SCHEMA extends SetAttribute | ListAttribute
  ? HasComputedDefaults<SCHEMA['elements'], VERB>
  : SCHEMA extends MapAttribute | Schema
  ? true extends {
      [ATTRIBUTE_NAME in keyof SCHEMA['attributes']]: HasComputedDefaults<
        SCHEMA['attributes'][ATTRIBUTE_NAME],
        VERB
      >
    }[keyof SCHEMA['attributes']]
    ? true
    : false
  : false
