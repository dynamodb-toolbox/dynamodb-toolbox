import type { O } from 'ts-toolbelt'

import type {
  Schema,
  Attribute,
  AttributeValue,
  ResolvePrimitiveAttribute,
  MapAttributeValue,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  Always,
  Never,
  ComputedDefault
} from 'v1/schema'
import type { OptionalizeUndefinableProperties } from 'v1/types/optionalizeUndefinableProperties'
import type { EntityV2 } from 'v1/entity'
import type { If } from 'v1/types/if'

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  REQUIRED_DEFAULTS extends 'none' | 'independent' | 'all' = 'none'
> =
  // Enforce Required attributes that don't have default values
  ATTRIBUTE extends { required: Always; defaults: { key: undefined } }
    ? true
    : // Add attributes with independent defaults if REQUIRED_DEFAULTS is 'independent'
    REQUIRED_DEFAULTS extends 'independent'
    ? ATTRIBUTE extends { defaults: { key: undefined | ComputedDefault } }
      ? false
      : true
    : // Add all required attributes and those with independent defaults if REQUIRED_DEFAULTS is 'all'
    REQUIRED_DEFAULTS extends 'all'
    ? ATTRIBUTE extends { required: Always }
      ? true
      : ATTRIBUTE extends { defaults: { key: undefined | ComputedDefault } }
      ? false
      : true
    : false

/**
 * Key input of a single item command (GET, DELETE ...) for an Entity or Schema
 *
 * @param Schema Entity | Schema
 * @return Object
 */
export type KeyInput<
  SCHEMA extends EntityV2 | Schema,
  REQUIRED_DEFAULTS extends 'none' | 'independent' | 'all' = 'none'
> = EntityV2 extends SCHEMA
  ? MapAttributeValue
  : Schema extends SCHEMA
  ? MapAttributeValue
  : SCHEMA extends Schema
  ? OptionalizeUndefinableProperties<
      {
        // Keep only key attributes
        [KEY in O.SelectKeys<SCHEMA['attributes'], { key: true }>]: AttributeKeyInput<
          SCHEMA['attributes'][KEY],
          REQUIRED_DEFAULTS
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { key: true; required: Never }>
    >
  : SCHEMA extends EntityV2
  ? KeyInput<SCHEMA['schema'], REQUIRED_DEFAULTS>
  : never

/**
 * Key input of a single item command (GET, DELETE ...) for an Attribute
 *
 * @param Attribute Attribute
 * @return Any
 */
export type AttributeKeyInput<
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
          ? Set<AttributeKeyInput<ATTRIBUTE['elements'], REQUIRED_DEFAULTS>>
          : ATTRIBUTE extends ListAttribute
          ? AttributeKeyInput<ATTRIBUTE['elements'], REQUIRED_DEFAULTS>[]
          : ATTRIBUTE extends MapAttribute
          ? OptionalizeUndefinableProperties<
              {
                // Keep only key attributes
                [KEY in O.SelectKeys<ATTRIBUTE['attributes'], { key: true }>]: AttributeKeyInput<
                  ATTRIBUTE['attributes'][KEY],
                  REQUIRED_DEFAULTS
                >
              },
              // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
              O.SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { key: true; required: Never }>
            >
          : ATTRIBUTE extends RecordAttribute
          ? {
              [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?: AttributeKeyInput<
                ATTRIBUTE['elements'],
                REQUIRED_DEFAULTS
              >
            }
          : ATTRIBUTE extends AnyOfAttribute
          ? AttributeKeyInput<ATTRIBUTE['elements'][number], REQUIRED_DEFAULTS>
          : never)
