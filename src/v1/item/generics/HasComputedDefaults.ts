import type { _Item } from '../interface'
import type {
  _Attribute,
  _SetAttribute,
  _ListAttribute,
  _MapAttribute,
  ComputedDefault
} from '../attributes'

// TODO: Required in Entity constructor... See if possible to use only Item
/**
 * Wether an Item or Attribute has a default value that needs to be computed (recursive)
 *
 * @param Schema Item | Attribute
 * @return Boolean
 */
export type _HasComputedDefaults<SCHEMA extends _Item | _Attribute> = SCHEMA extends {
  _default: ComputedDefault
}
  ? true
  : SCHEMA extends _SetAttribute | _ListAttribute
  ? _HasComputedDefaults<SCHEMA['_elements']>
  : SCHEMA extends _MapAttribute | _Item
  ? true extends {
      [ATTRIBUTE_NAME in keyof SCHEMA['_attributes']]: _HasComputedDefaults<
        SCHEMA['_attributes'][ATTRIBUTE_NAME]
      >
    }[keyof SCHEMA['_attributes']]
    ? true
    : false
  : false
