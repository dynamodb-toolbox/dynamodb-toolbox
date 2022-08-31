import type { Item } from '../interface'
import type { Property, Mapped, List, ComputedDefault } from '../typers'

/**
 * Wether an Item or Property has a default value that needs to be computed (recursive)
 *
 * @param I Item / Property
 * @return Boolean
 */
export type HasComputedDefaults<P extends Item | Property> = P extends { _default: ComputedDefault }
  ? true
  : P extends List
  ? // Check if elements have computed defaults
    HasComputedDefaults<P['_elements']>
  : P extends Mapped | Item
  ? // Check if one property has computed default
    true extends {
      [K in keyof P['_properties']]: HasComputedDefaults<P['_properties'][K]>
    }[keyof P['_properties']]
    ? true
    : false
  : never
