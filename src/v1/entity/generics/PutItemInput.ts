import type { O } from 'ts-toolbelt'

import type {
  _Item,
  Item,
  _Attribute,
  Attribute,
  ResolvedAttribute,
  _AnyAttribute,
  AnyAttribute,
  _PrimitiveAttribute,
  PrimitiveAttribute,
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
  SCHEMA extends EntityV2 | Item | Attribute,
  REQUIRE_INITIAL_DEFAULTS extends boolean = false
> = SCHEMA extends AnyAttribute
  ? ResolvedAttribute
  : SCHEMA extends PrimitiveAttribute
  ? NonNullable<SCHEMA['resolved']>
  : SCHEMA extends SetAttribute
  ? Set<PutItemInput<SCHEMA['elements'], REQUIRE_INITIAL_DEFAULTS>>
  : SCHEMA extends ListAttribute
  ? PutItemInput<SCHEMA['elements'], REQUIRE_INITIAL_DEFAULTS>[]
  : SCHEMA extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof SCHEMA['attributes']]: PutItemInput<
            SCHEMA['attributes'][KEY],
            REQUIRE_INITIAL_DEFAULTS
          >
        }
      >,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          SCHEMA['attributes'],
          { required: AtLeastOnce | OnlyOnce | Always; default: undefined }
        >
      // Add attributes with initial (non-computed) defaults if RequireInitialDefaults is true
      | (REQUIRE_INITIAL_DEFAULTS extends true
          ? O.FilterKeys<SCHEMA['attributes'], { default: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedAttribute> if map is open
      (SCHEMA extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : SCHEMA extends EntityV2
  ? PutItemInput<SCHEMA['item'], REQUIRE_INITIAL_DEFAULTS>
  : never

// TODO: Required in Entity constructor... See if possible to use only PutItemInput
export type _PutItemInput<
  _SCHEMA extends EntityV2 | _Item | _Attribute,
  REQUIRE_INITIAL_DEFAULTS extends boolean = false
> = _SCHEMA extends _AnyAttribute
  ? ResolvedAttribute
  : _SCHEMA extends _PrimitiveAttribute
  ? NonNullable<_SCHEMA['_resolved']>
  : _SCHEMA extends _SetAttribute
  ? Set<_PutItemInput<_SCHEMA['_elements'], REQUIRE_INITIAL_DEFAULTS>>
  : _SCHEMA extends _ListAttribute
  ? _PutItemInput<_SCHEMA['_elements'], REQUIRE_INITIAL_DEFAULTS>[]
  : _SCHEMA extends _MapAttribute | _Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof _SCHEMA['_attributes']]: _PutItemInput<
            _SCHEMA['_attributes'][KEY],
            REQUIRE_INITIAL_DEFAULTS
          >
        }
      >,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          _SCHEMA['_attributes'],
          { _required: AtLeastOnce | OnlyOnce | Always; _default: undefined }
        >
      // Add attributes with initial (non-computed) defaults if RequireInitialDefaults is true
      | (REQUIRE_INITIAL_DEFAULTS extends true
          ? O.FilterKeys<_SCHEMA['_attributes'], { _default: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedAttribute> if map is open
      (_SCHEMA extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : _SCHEMA extends EntityV2
  ? _PutItemInput<_SCHEMA['_item'], REQUIRE_INITIAL_DEFAULTS>
  : never
