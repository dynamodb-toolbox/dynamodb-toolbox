import type { O } from 'ts-toolbelt'

import type {
  _Item,
  FrozenItem,
  _Attribute,
  FrozenAttribute,
  ResolvedAttribute,
  _AnyAttribute,
  FrozenAnyAttribute,
  _LeafAttribute,
  FrozenLeafAttribute,
  _SetAttribute,
  FrozenSetAttribute,
  _ListAttribute,
  FrozenListAttribute,
  _MapAttribute,
  FrozenMapAttribute,
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * User input of a PUT command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @param RequireInitialDefaults Boolean
 * @return Object
 */
export type PutItemInput<
  Input extends EntityV2 | FrozenItem | FrozenAttribute,
  RequireInitialDefaults extends boolean = false
> = Input extends FrozenAnyAttribute
  ? ResolvedAttribute
  : Input extends FrozenLeafAttribute
  ? NonNullable<Input['resolved']>
  : Input extends FrozenSetAttribute
  ? Set<PutItemInput<Input['elements'], RequireInitialDefaults>>
  : Input extends FrozenListAttribute
  ? PutItemInput<Input['elements'], RequireInitialDefaults>[]
  : Input extends FrozenMapAttribute | FrozenItem
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof Input['attributes']]: PutItemInput<
            Input['attributes'][key],
            RequireInitialDefaults
          >
        }
      >,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          Input['attributes'],
          { required: AtLeastOnce | OnlyOnce | Always; default: undefined }
        >
      // Add attributes with initial (non-computed) defaults if RequireInitialDefaults is true
      | (RequireInitialDefaults extends true
          ? O.FilterKeys<Input['attributes'], { default: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? PutItemInput<Input['frozenItem'], RequireInitialDefaults>
  : never

// TODO: Required in Entity constructor... See if possible to use only PutItemInput
export type _PutItemInput<
  Input extends EntityV2 | _Item | _Attribute,
  RequireInitialDefaults extends boolean = false
> = Input extends _AnyAttribute
  ? ResolvedAttribute
  : Input extends _LeafAttribute
  ? NonNullable<Input['_resolved']>
  : Input extends _SetAttribute
  ? Set<_PutItemInput<Input['_elements'], RequireInitialDefaults>>
  : Input extends _ListAttribute
  ? _PutItemInput<Input['_elements'], RequireInitialDefaults>[]
  : Input extends _MapAttribute | _Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof Input['_attributes']]: _PutItemInput<
            Input['_attributes'][key],
            RequireInitialDefaults
          >
        }
      >,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          Input['_attributes'],
          { _required: AtLeastOnce | OnlyOnce | Always; _default: undefined }
        >
      // Add attributes with initial (non-computed) defaults if RequireInitialDefaults is true
      | (RequireInitialDefaults extends true
          ? O.FilterKeys<Input['_attributes'], { _default: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? _PutItemInput<Input['_item'], RequireInitialDefaults>
  : never
