import type { Item } from '../interface'
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
 * @param Input Item | Attribute
 * @return Boolean
 */
export type HasComputedDefaults<Input extends Item | Attribute> = Input extends {
  _default: ComputedDefault
}
  ? true
  : Input extends SetAttribute | ListAttribute
  ? HasComputedDefaults<Input['_elements']>
  : Input extends MapAttribute | Item
  ? true extends {
      [K in keyof Input['_attributes']]: HasComputedDefaults<Input['_attributes'][K]>
    }[keyof Input['_attributes']]
    ? true
    : false
  : never
