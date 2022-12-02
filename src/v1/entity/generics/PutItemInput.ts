import type { O } from 'ts-toolbelt'

import type {
  _Item,
  Item,
  _Attribute,
  Attribute,
  ResolvedAttribute,
  _AnyAttribute,
  AnyAttribute,
  _LeafAttribute,
  LeafAttribute,
  _SetAttribute,
  SetAttribute,
  _ListAttribute,
  ListAttribute,
  _MapAttribute,
  MapAttribute,
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
  INPUT extends EntityV2 | Item | Attribute,
  REQUIRE_INITIAL_DEFAULTS extends boolean = false
> = INPUT extends AnyAttribute
  ? ResolvedAttribute
  : INPUT extends LeafAttribute
  ? NonNullable<INPUT['resolved']>
  : INPUT extends SetAttribute
  ? Set<PutItemInput<INPUT['elements'], REQUIRE_INITIAL_DEFAULTS>>
  : INPUT extends ListAttribute
  ? PutItemInput<INPUT['elements'], REQUIRE_INITIAL_DEFAULTS>[]
  : INPUT extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof INPUT['attributes']]: PutItemInput<
            INPUT['attributes'][key],
            REQUIRE_INITIAL_DEFAULTS
          >
        }
      >,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          INPUT['attributes'],
          { required: AtLeastOnce | OnlyOnce | Always; default: undefined }
        >
      // Add attributes with initial (non-computed) defaults if RequireInitialDefaults is true
      | (REQUIRE_INITIAL_DEFAULTS extends true
          ? O.FilterKeys<INPUT['attributes'], { default: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedAttribute> if map is open
      (INPUT extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : INPUT extends EntityV2
  ? PutItemInput<INPUT['item'], REQUIRE_INITIAL_DEFAULTS>
  : never

// TODO: Required in Entity constructor... See if possible to use only PutItemInput
export type _PutItemInput<
  INPUT extends EntityV2 | _Item | _Attribute,
  REQUIRE_INITIAL_DEFAULTS extends boolean = false
> = INPUT extends _AnyAttribute
  ? ResolvedAttribute
  : INPUT extends _LeafAttribute
  ? NonNullable<INPUT['_resolved']>
  : INPUT extends _SetAttribute
  ? Set<_PutItemInput<INPUT['_elements'], REQUIRE_INITIAL_DEFAULTS>>
  : INPUT extends _ListAttribute
  ? _PutItemInput<INPUT['_elements'], REQUIRE_INITIAL_DEFAULTS>[]
  : INPUT extends _MapAttribute | _Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof INPUT['_attributes']]: _PutItemInput<
            INPUT['_attributes'][key],
            REQUIRE_INITIAL_DEFAULTS
          >
        }
      >,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          INPUT['_attributes'],
          { _required: AtLeastOnce | OnlyOnce | Always; _default: undefined }
        >
      // Add attributes with initial (non-computed) defaults if RequireInitialDefaults is true
      | (REQUIRE_INITIAL_DEFAULTS extends true
          ? O.FilterKeys<INPUT['_attributes'], { _default: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedAttribute> if map is open
      (INPUT extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : INPUT extends EntityV2
  ? _PutItemInput<INPUT['_item'], REQUIRE_INITIAL_DEFAULTS>
  : never
