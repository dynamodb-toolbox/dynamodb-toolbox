import type { _Item } from '../interface'
import type {
  _Attribute,
  _SetAttribute,
  _ListAttribute,
  _MapAttribute,
  ComputedDefault
} from '../attributes'
import { $elements, $attributes, $default } from '../attributes/constants/symbols'

// TODO: Required in Entity constructor... See if possible to use only Item
/**
 * Wether an Item or Attribute has a default value that needs to be computed (recursive)
 *
 * @param Schema Item | Attribute
 * @return Boolean
 */
export type _HasComputedDefaults<SCHEMA extends _Item | _Attribute> = SCHEMA extends {
  [$default]: ComputedDefault
}
  ? true
  : SCHEMA extends _SetAttribute | _ListAttribute
  ? _HasComputedDefaults<SCHEMA[$elements]>
  : SCHEMA extends _MapAttribute | _Item
  ? true extends {
      [ATTRIBUTE_NAME in keyof SCHEMA[$attributes]]: _HasComputedDefaults<
        SCHEMA[$attributes][ATTRIBUTE_NAME]
      >
    }[keyof SCHEMA[$attributes]]
    ? true
    : false
  : false
