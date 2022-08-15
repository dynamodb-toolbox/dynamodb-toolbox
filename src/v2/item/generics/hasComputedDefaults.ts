import type { Item } from '../interface'
import type { Property, Mapped, List, ComputedDefault } from '../typers'

export type HasComputedDefaults<P extends Item | Property> = P extends { _default: ComputedDefault }
  ? true
  : P extends List
  ? HasComputedDefaults<P['_elements']>
  : P extends Mapped | Item
  ? true extends {
      [K in keyof P['_properties']]: HasComputedDefaults<P['_properties'][K]>
    }[keyof P['_properties']]
    ? true
    : false
  : never
