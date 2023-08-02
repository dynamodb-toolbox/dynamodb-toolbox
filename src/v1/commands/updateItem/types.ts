import type { O } from 'ts-toolbelt'

import type {
  Schema,
  Attribute,
  AttributeValue,
  ResolvePrimitiveAttribute,
  Item,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Always,
  Never,
  ComputedDefault
} from 'v1/schema'
import type { OptionalizeUndefinableProperties } from 'v1/types/optionalizeUndefinableProperties'
import type { EntityV2 } from 'v1/entity/class'
import type { If } from 'v1/types/if'
import type { AttributePutItemInput } from 'v1/commands/putItem/types'

import type { $partial, $set, $add, $delete, $remove } from './constants'

export type UpdateItemInputExtension =
  | { type: '*'; value: $remove }
  | {
      type: 'number'
      value: { [$add]: number }
    }
  | {
      type: 'set'
      value:
        | { [$add]: AttributeValue<UpdateItemInputExtension> }
        | { [$delete]: AttributeValue<UpdateItemInputExtension> }
    }
  | {
      type: 'list'
      value: { [INDEX in number]: AttributeValue<UpdateItemInputExtension> }
    }
  | {
      type: 'map'
      value: { [$set]: AttributeValue<UpdateItemInputExtension> }
    }
  | {
      type: 'record'
      // Specifying { [$partial]: false } vs { [$partial]?: true } is required for type inference
      // Otherwise { [$set]: ... } can be assigned to an empty set
      // (specifying { [$set]?: never } for partial updates works but type error message is more confusing)
      value: { [$partial]?: false } & { [$set]: AttributeValue<UpdateItemInputExtension> }
    }

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false
> =
  // Enforce Required attributes that don't have default values
  ATTRIBUTE extends { required: Always } & (
    | { key: true; defaults: { key: undefined } }
    | { key: false; defaults: { update: undefined } }
  )
    ? true
    : REQUIRE_INDEPENDENT_DEFAULTS extends true
    ? // Add attributes with independent defaults if REQUIRE_INDEPENDENT_DEFAULTS is true
      ATTRIBUTE extends
        | { key: true; defaults: { key: undefined | ComputedDefault } }
        | { key: false; defaults: { update: undefined | ComputedDefault } }
      ? false
      : true
    : false

type CanBeRemoved<ATTRIBUTE extends Attribute> = ATTRIBUTE extends { required: 'never' }
  ? true
  : false

/**
 * User input of an UPDATE command for a given Entity or Schema
 *
 * @param Schema Entity | Schema
 * @param RequireIndependentDefaults Boolean
 * @return Object
 */
export type UpdateItemInput<
  SCHEMA extends EntityV2 | Schema,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false
> = EntityV2 extends SCHEMA
  ? Item<UpdateItemInputExtension>
  : Schema extends SCHEMA
  ? Item<UpdateItemInputExtension>
  : SCHEMA extends Schema
  ? OptionalizeUndefinableProperties<
      {
        [KEY in keyof SCHEMA['attributes']]: AttributeUpdateItemInput<
          SCHEMA['attributes'][KEY],
          REQUIRE_INDEPENDENT_DEFAULTS
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: AtLeastOnce | Never }>
    >
  : SCHEMA extends EntityV2
  ? UpdateItemInput<SCHEMA['schema'], REQUIRE_INDEPENDENT_DEFAULTS>
  : never

/**
 * User input of an UPDATE command for a given Attribute
 *
 * @param Attribute Attribute
 * @param RequireIndependentDefaults Boolean
 * @return Any
 */
export type AttributeUpdateItemInput<
  ATTRIBUTE extends Attribute,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false
> = Attribute extends ATTRIBUTE
  ? AttributeValue<UpdateItemInputExtension> | undefined
  :
      | If<MustBeDefined<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS>, never, undefined>
      | If<CanBeRemoved<ATTRIBUTE>, $remove, never>
      | (ATTRIBUTE extends AnyAttribute
          ? unknown
          : ATTRIBUTE extends PrimitiveAttribute
          ?
              | ResolvePrimitiveAttribute<ATTRIBUTE>
              | (ATTRIBUTE extends PrimitiveAttribute<'number'>
                  ? { [$add]: ResolvePrimitiveAttribute<ATTRIBUTE> }
                  : never)
          : ATTRIBUTE extends SetAttribute
          ?
              | Set<AttributeUpdateItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>>
              | {
                  [$add]: Set<
                    AttributeUpdateItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>
                  >
                }
              | {
                  [$delete]: Set<
                    AttributeUpdateItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>
                  >
                }
          : ATTRIBUTE extends ListAttribute
          ?
              | {
                  [INDEX in number]:
                    | AttributeUpdateItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>
                    | $remove
                }
              | AttributeUpdateItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>[]
          : ATTRIBUTE extends MapAttribute
          ?
              | { [$set]: AttributePutItemInput<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS> }
              | OptionalizeUndefinableProperties<
                  {
                    [KEY in keyof ATTRIBUTE['attributes']]: AttributeUpdateItemInput<
                      ATTRIBUTE['attributes'][KEY],
                      REQUIRE_INDEPENDENT_DEFAULTS
                    >
                  },
                  // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
                  O.SelectKeys<
                    ATTRIBUTE['attributes'],
                    AnyAttribute & { required: AtLeastOnce | Never }
                  >
                >
          : ATTRIBUTE extends RecordAttribute
          ?
              | {
                  [$partial]?: false
                  [$set]: AttributePutItemInput<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS>
                }
              | ({ [$partial]?: true } & {
                  [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?:
                    | AttributeUpdateItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>
                    | $remove
                })
          : ATTRIBUTE extends AnyOfAttribute
          ? AttributeUpdateItemInput<ATTRIBUTE['elements'][number], REQUIRE_INDEPENDENT_DEFAULTS>
          : never)
