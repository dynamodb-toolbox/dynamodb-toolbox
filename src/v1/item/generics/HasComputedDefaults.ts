import type { Item } from '../interface'
import type { Property, Mapped, List, ComputedDefault } from '../typers'

/**
 * Wether an Item or Property has a default value that needs to be computed (recursive)
 *
 * @param Input Item | Property
 * @return Boolean
 */
export type HasComputedDefaults<Input extends Item | Property> = Input extends {
  _default: ComputedDefault
}
  ? true
  : Input extends List
  ? HasComputedDefaults<Input['_elements']>
  : Input extends Mapped | Item
  ? true extends {
      [K in keyof Input['_properties']]: HasComputedDefaults<Input['_properties'][K]>
    }[keyof Input['_properties']]
    ? true
    : false
  : never
