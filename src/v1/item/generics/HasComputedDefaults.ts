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
 * @param Input Item | Attribute
 * @return Boolean
 */
export type _HasComputedDefaults<INPUT extends _Item | _Attribute> = INPUT extends {
  _default: ComputedDefault
}
  ? true
  : INPUT extends _SetAttribute | _ListAttribute
  ? _HasComputedDefaults<INPUT['_elements']>
  : INPUT extends _MapAttribute | _Item
  ? true extends {
      [ATTRIBUTE_NAME in keyof INPUT['_attributes']]: _HasComputedDefaults<
        INPUT['_attributes'][ATTRIBUTE_NAME]
      >
    }[keyof INPUT['_attributes']]
    ? true
    : false
  : false
