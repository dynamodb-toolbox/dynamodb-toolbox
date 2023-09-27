import type { O } from 'ts-toolbelt'

import type {
  Schema,
  Attribute,
  Item,
  AttributeValue,
  ResolvePrimitiveAttribute,
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

export type MustBeDefined<
  ATTRIBUTE extends Attribute,
  REQUIRED_DEFAULTS extends 'none' | 'independent' | 'all' = 'none'
> =
  // Enforce Required attributes that don't have default values
  ATTRIBUTE extends { required: AtLeastOnce | Always } & (
    | { key: true; defaults: { key: undefined } }
    | { key: false; defaults: { put: undefined } }
  )
    ? true
    : // Add attributes with independent defaults if REQUIRED_DEFAULTS is 'independent'
    REQUIRED_DEFAULTS extends 'independent'
    ? ATTRIBUTE extends
        | { key: true; defaults: { key: undefined | ComputedDefault } }
        | { key: false; defaults: { put: undefined | ComputedDefault } }
      ? false
      : true
    : // Add all required attributes and those with independent defaults if REQUIRED_DEFAULTS is 'all'
    REQUIRED_DEFAULTS extends 'all'
    ? ATTRIBUTE extends { required: AtLeastOnce | Always }
      ? true
      : ATTRIBUTE extends
          | { key: true; defaults: { key: undefined | ComputedDefault } }
          | { key: false; defaults: { put: undefined | ComputedDefault } }
      ? false
      : true
    : false

/**
 * User input of a PUT command for a given Entity or Schema
 *
 * @param Schema Entity | Schema
 * @param RequireIndependentDefaults Boolean
 * @return Object
 */
export type PutItemInput<
  SCHEMA extends EntityV2 | Schema,
  REQUIRED_DEFAULTS extends 'none' | 'independent' | 'all' = 'none'
> = EntityV2 extends SCHEMA
  ? Item
  : Schema extends SCHEMA
  ? Item
  : SCHEMA extends Schema
  ? OptionalizeUndefinableProperties<
      {
        [KEY in keyof SCHEMA['attributes']]: AttributePutItemInput<
          SCHEMA['attributes'][KEY],
          REQUIRED_DEFAULTS
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: Never }>
    >
  : SCHEMA extends EntityV2
  ? PutItemInput<SCHEMA['schema'], REQUIRED_DEFAULTS>
  : never

/**
 * User input of a PUT command for a given Attribute
 *
 * @param Attribute Attribute
 * @param RequireIndependentDefaults Boolean
 * @return Any
 */
export type AttributePutItemInput<
  ATTRIBUTE extends Attribute,
  REQUIRED_DEFAULTS extends 'none' | 'independent' | 'all' = 'none'
> = Attribute extends ATTRIBUTE
  ? AttributeValue | undefined
  :
      | If<MustBeDefined<ATTRIBUTE, REQUIRED_DEFAULTS>, never, undefined>
      | (ATTRIBUTE extends AnyAttribute
          ? unknown
          : ATTRIBUTE extends PrimitiveAttribute
          ? ResolvePrimitiveAttribute<ATTRIBUTE>
          : ATTRIBUTE extends SetAttribute
          ? Set<AttributePutItemInput<ATTRIBUTE['elements'], REQUIRED_DEFAULTS>>
          : ATTRIBUTE extends ListAttribute
          ? AttributePutItemInput<ATTRIBUTE['elements'], REQUIRED_DEFAULTS>[]
          : ATTRIBUTE extends MapAttribute
          ? OptionalizeUndefinableProperties<
              {
                [KEY in keyof ATTRIBUTE['attributes']]: AttributePutItemInput<
                  ATTRIBUTE['attributes'][KEY],
                  REQUIRED_DEFAULTS
                >
              },
              // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
              O.SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
            >
          : ATTRIBUTE extends RecordAttribute
          ? {
              [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?: AttributePutItemInput<
                ATTRIBUTE['elements'],
                REQUIRED_DEFAULTS
              >
            }
          : ATTRIBUTE extends AnyOfAttribute
          ? AttributePutItemInput<ATTRIBUTE['elements'][number], REQUIRED_DEFAULTS>
          : never)
