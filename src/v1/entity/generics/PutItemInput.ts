import type { O } from 'ts-toolbelt'

import type {
  $Item,
  Item,
  $Attribute,
  Attribute,
  ResolvedAttribute,
  $AnyAttribute,
  AnyAttribute,
  $ConstantAttribute,
  ConstantAttribute,
  $PrimitiveAttribute,
  PrimitiveAttribute,
  $SetAttribute,
  SetAttribute,
  $ListAttribute,
  ListAttribute,
  $MapAttribute,
  MapAttribute,
  $AnyOfAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault,
  $ResolveConstantAttribute,
  ResolveConstantAttribute,
  $ResolvePrimitiveAttribute,
  ResolvePrimitiveAttribute
} from 'v1/item'
import type {
  $elements,
  $attributes,
  $required,
  $open,
  $default
} from 'v1/item/attributes/constants/attributeOptions'

import type { EntityV2 } from '../class'

/**
 * User input of a PUT command for a given Entity, Item or Attribute
 *
 * @param Schema Entity | Item | Attribute
 * @param RequireHardDefaults Boolean
 * @return Object
 */
export type PutItemInput<
  SCHEMA extends EntityV2 | Item | Attribute,
  REQUIRE_HARD_DEFAULTS extends boolean = false
> = SCHEMA extends AnyAttribute
  ? ResolvedAttribute
  : SCHEMA extends ConstantAttribute
  ? ResolveConstantAttribute<SCHEMA>
  : SCHEMA extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<SCHEMA>
  : SCHEMA extends SetAttribute
  ? Set<PutItemInput<SCHEMA['elements'], REQUIRE_HARD_DEFAULTS>>
  : SCHEMA extends ListAttribute
  ? PutItemInput<SCHEMA['elements'], REQUIRE_HARD_DEFAULTS>[]
  : SCHEMA extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof SCHEMA['attributes']]: PutItemInput<
            SCHEMA['attributes'][KEY],
            REQUIRE_HARD_DEFAULTS
          >
        }
      >,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          SCHEMA['attributes'],
          { required: AtLeastOnce | OnlyOnce | Always; default: undefined }
        >
      // Add attributes with hard (non-computed) defaults if REQUIRE_HARD_DEFAULTS is true
      | (REQUIRE_HARD_DEFAULTS extends true
          ? O.FilterKeys<SCHEMA['attributes'], { default: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedAttribute> if map is open
      (SCHEMA extends { open: true } ? Record<string, ResolvedAttribute> : unknown)
  : SCHEMA extends AnyOfAttribute
  ? PutItemInput<SCHEMA['elements'][number], REQUIRE_HARD_DEFAULTS>
  : SCHEMA extends EntityV2
  ? PutItemInput<SCHEMA['item'], REQUIRE_HARD_DEFAULTS>
  : never

// TODO: Required in Entity constructor... See if possible to use only PutItemInput
export type $PutItemInput<
  $SCHEMA extends EntityV2 | $Item | $Attribute,
  REQUIRE_HARD_DEFAULTS extends boolean = false
> = $SCHEMA extends $AnyAttribute
  ? ResolvedAttribute
  : $SCHEMA extends $ConstantAttribute
  ? $ResolveConstantAttribute<$SCHEMA>
  : $SCHEMA extends $PrimitiveAttribute
  ? $ResolvePrimitiveAttribute<$SCHEMA>
  : $SCHEMA extends $SetAttribute
  ? Set<$PutItemInput<$SCHEMA[$elements], REQUIRE_HARD_DEFAULTS>>
  : $SCHEMA extends $ListAttribute
  ? $PutItemInput<$SCHEMA[$elements], REQUIRE_HARD_DEFAULTS>[]
  : $SCHEMA extends $MapAttribute | $Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [KEY in keyof $SCHEMA[$attributes]]: $PutItemInput<
            $SCHEMA[$attributes][KEY],
            REQUIRE_HARD_DEFAULTS
          >
        }
      >,
      // Enforce Required attributes except those that have default (will be provided by the lib)
      | O.SelectKeys<
          $SCHEMA[$attributes],
          { [$required]: AtLeastOnce | OnlyOnce | Always; [$default]: undefined }
        >
      // Add attributes with hard (non-computed) defaults if REQUIRE_HARD_DEFAULTS is true
      | (REQUIRE_HARD_DEFAULTS extends true
          ? O.FilterKeys<$SCHEMA[$attributes], { [$default]: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedAttribute> if map is open
      ($SCHEMA extends { [$open]: true } ? Record<string, ResolvedAttribute> : unknown)
  : $SCHEMA extends $AnyOfAttribute
  ? $PutItemInput<$SCHEMA[$elements][number], REQUIRE_HARD_DEFAULTS>
  : $SCHEMA extends EntityV2
  ? $PutItemInput<$SCHEMA['$item'], REQUIRE_HARD_DEFAULTS>
  : never
