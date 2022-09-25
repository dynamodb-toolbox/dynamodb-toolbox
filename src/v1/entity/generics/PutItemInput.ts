import type { O } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
import type {
  Property,
  ResolvedProperty,
  Leaf,
  Mapped,
  List,
  Any,
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item/typers'

import type { EntityV2 } from '../class'

/**
 * User input of a PUT command for a given Entity, Item or Property
 *
 * @param Input Entity | Item | Property
 * @param RequireInitialDefaults Boolean
 * @return Object
 */
export type PutItemInput<
  Input extends EntityV2 | Item | Property,
  RequireInitialDefaults extends boolean = false
> = Input extends Any
  ? ResolvedProperty
  : Input extends Leaf
  ? NonNullable<Input['_resolved']>
  : Input extends List
  ? PutItemInput<Input['_elements'], RequireInitialDefaults>[]
  : Input extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Keep all properties
          [key in keyof Input['_properties']]: PutItemInput<
            Input['_properties'][key],
            RequireInitialDefaults
          >
        }
      >,
      // Enforce Required properties except those that have default (will be provided by the lib)
      | O.SelectKeys<
          Input['_properties'],
          { _required: AtLeastOnce | OnlyOnce | Always; _default: undefined }
        >
      // Add properties with initial (non-computed) defaults if RequireInitialDefaults is true
      | (RequireInitialDefaults extends true
          ? O.FilterKeys<Input['_properties'], { _default: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedProperty> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : Input extends EntityV2
  ? PutItemInput<Input['item'], RequireInitialDefaults>
  : never
