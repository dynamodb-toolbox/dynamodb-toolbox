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
export type _HasComputedDefaults<Input extends _Item | _Attribute> = Input extends {
  _default: ComputedDefault
}
  ? true
  : Input extends _SetAttribute | _ListAttribute
  ? _HasComputedDefaults<Input['_elements']>
  : Input extends _MapAttribute | _Item
  ? true extends {
      [K in keyof Input['_attributes']]: _HasComputedDefaults<Input['_attributes'][K]>
    }[keyof Input['_attributes']]
    ? true
    : false
  : never
