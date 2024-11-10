import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  Attribute,
  AttributeValue,
  Item,
  ListAttribute,
  ListAttributeValue,
  MapAttribute,
  MapAttributeValue,
  Never,
  NumberAttribute,
  NumberAttributeValue,
  PrimitiveAttribute,
  RecordAttribute,
  RecordAttributeValue,
  ResolveAnyAttribute,
  ResolvePrimitiveAttribute,
  ResolveStringAttribute,
  SetAttribute,
  SetAttributeValue
} from '~/attributes/index.js'
import type { Entity } from '~/entity/index.js'
import type { Paths, Schema, ValidValue } from '~/schema/index.js'
import type { If } from '~/types/if.js'
import type { Optional } from '~/types/optional.js'

import type {
  $ADD,
  $APPEND,
  $DELETE,
  $GET,
  $PREPEND,
  $REMOVE,
  $SET,
  $SUBTRACT,
  $SUM,
  ADD,
  APPEND,
  Basic,
  DELETE,
  Extension,
  GET,
  PREPEND,
  REMOVE,
  SET,
  SUBTRACT,
  SUM
} from './symbols/index.js'

export type ReferenceExtension = {
  type: '*'
  value: Extension<{ [$GET]: [ref: string, fallback?: AttributeValue<ReferenceExtension>] }>
}

export type UpdateItemInputExtension =
  | ReferenceExtension
  | { type: '*'; value: Extension<{ [$REMOVE]: true }> }
  | {
      type: 'number'
      value:
        | Extension<{ [$ADD]: number }>
        | Extension<{
            [$SUM]: [
              NumberAttributeValue<ReferenceExtension>,
              NumberAttributeValue<ReferenceExtension>
            ]
          }>
        | Extension<{
            [$SUBTRACT]: [
              NumberAttributeValue<ReferenceExtension>,
              NumberAttributeValue<ReferenceExtension>
            ]
          }>
    }
  | {
      type: 'set'
      value: Extension<{ [$ADD]: SetAttributeValue } | { [$DELETE]: SetAttributeValue }>
    }
  | {
      type: 'list'
      value:
        | Basic<{ [INDEX in number]: AttributeValue<UpdateItemInputExtension> | undefined }>
        | Extension<{ [$SET]: ListAttributeValue }>
        | Extension<
            | { [$APPEND]: AttributeValue<ReferenceExtension> | AttributeValue[] }
            | { [$PREPEND]: AttributeValue<ReferenceExtension> | AttributeValue[] }
            // TODO: CONCAT to join two unrelated lists
          >
    }
  | {
      type: 'map'
      value: Extension<{ [$SET]: MapAttributeValue }>
    }
  | {
      type: 'record'
      value: Extension<{ [$SET]: RecordAttributeValue }>
    }

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  FILLED extends boolean = false
> = FILLED extends true
  ? ATTRIBUTE extends { required: Always }
    ? true
    : false
  : ATTRIBUTE extends { required: Always } & (
        | {
            key: true
            defaults: { key: undefined }
            links: { key: undefined }
          }
        | {
            key: false
            defaults: { update: undefined }
            links: { update: undefined }
          }
      )
    ? true
    : false

type OptionalKeys<SCHEMA extends Schema | MapAttribute, FILLED extends boolean = false> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeDefined<SCHEMA['attributes'][KEY], FILLED>,
    never,
    KEY
  >
}[keyof SCHEMA['attributes']]

type CanBeRemoved<ATTRIBUTE extends Attribute> = ATTRIBUTE extends { required: Never }
  ? true
  : false

/**
 * User input of an UPDATE command for a given Entity or Schema
 *
 * @param Schema Entity | Schema
 * @param RequireDefaults Boolean
 * @return Object
 */
export type UpdateItemInput<
  SCHEMA extends Entity | Schema = Entity,
  FILLED extends boolean = false
> = Entity extends SCHEMA
  ? Item<UpdateItemInputExtension>
  : Schema extends SCHEMA
    ? Item<UpdateItemInputExtension>
    : SCHEMA extends Schema
      ? Optional<
          {
            [KEY in keyof SCHEMA['attributes']]: AttributeUpdateItemInput<
              SCHEMA['attributes'][KEY],
              FILLED,
              Paths<SCHEMA>
            >
          },
          OptionalKeys<SCHEMA, FILLED>
        >
      : SCHEMA extends Entity
        ? UpdateItemInput<SCHEMA['schema'], FILLED>
        : never

export type Reference<
  ATTRIBUTE extends Attribute,
  SCHEMA_ATTRIBUTE_PATHS extends string = string
> = GET<
  [
    ref: SCHEMA_ATTRIBUTE_PATHS,
    fallback?:
      | ValidValue<ATTRIBUTE, { defined: true }>
      | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
  ]
>

type NumberUpdate<ATTRIBUTE extends NumberAttribute> =
  | number
  | (ATTRIBUTE extends { big: true } ? bigint : never)

/**
 * User input of an UPDATE command for a given Attribute
 *
 * @param Attribute Attribute
 * @param RequireDefaults Boolean
 * @return Any
 */
export type AttributeUpdateItemInput<
  ATTRIBUTE extends Attribute = Attribute,
  FILLED extends boolean = false,
  SCHEMA_ATTRIBUTE_PATHS extends string = string
> = Attribute extends ATTRIBUTE
  ? AttributeValue<UpdateItemInputExtension> | undefined
  :
      | If<MustBeDefined<ATTRIBUTE, FILLED>, never, undefined>
      | If<CanBeRemoved<ATTRIBUTE>, REMOVE, never>
      // Not using Reference<...> for improved type display
      | GET<
          [
            ref: SCHEMA_ATTRIBUTE_PATHS,
            fallback?:
              | ValidValue<ATTRIBUTE, { defined: true }>
              | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
          ]
        >
      | (ATTRIBUTE extends AnyAttribute ? ResolveAnyAttribute<ATTRIBUTE> | unknown : never)
      | (ATTRIBUTE extends PrimitiveAttribute ? ResolvePrimitiveAttribute<ATTRIBUTE> : never)
      | (ATTRIBUTE extends NumberAttribute
          ?
              | ADD<NumberUpdate<ATTRIBUTE>>
              | SUM<
                  // Not using Reference<...> for improved type display
                  | NumberUpdate<ATTRIBUTE>
                  | GET<
                      [
                        ref: SCHEMA_ATTRIBUTE_PATHS,
                        fallback?:
                          | NumberUpdate<ATTRIBUTE>
                          | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                      ]
                    >,
                  // Not using Reference<...> for improved type display
                  | NumberUpdate<ATTRIBUTE>
                  | GET<
                      [
                        ref: SCHEMA_ATTRIBUTE_PATHS,
                        fallback?:
                          | NumberUpdate<ATTRIBUTE>
                          | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                      ]
                    >
                >
              | SUBTRACT<
                  // Not using Reference<...> for improved type display
                  | NumberUpdate<ATTRIBUTE>
                  | GET<
                      [
                        ref: SCHEMA_ATTRIBUTE_PATHS,
                        fallback?:
                          | NumberUpdate<ATTRIBUTE>
                          | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                      ]
                    >,
                  // Not using Reference<...> for improved type display
                  | NumberUpdate<ATTRIBUTE>
                  | GET<
                      [
                        ref: SCHEMA_ATTRIBUTE_PATHS,
                        fallback?:
                          | NumberUpdate<ATTRIBUTE>
                          | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                      ]
                    >
                >
          : never)
      | (ATTRIBUTE extends SetAttribute
          ?
              | Set<ValidValue<ATTRIBUTE['elements']>>
              | ADD<Set<ValidValue<ATTRIBUTE['elements']>>>
              | DELETE<Set<ValidValue<ATTRIBUTE['elements']>>>
          : never)
      | (ATTRIBUTE extends ListAttribute
          ?
              | Basic<{
                  [INDEX in number]?:
                    | AttributeUpdateItemInput<
                        ATTRIBUTE['elements'],
                        FILLED,
                        SCHEMA_ATTRIBUTE_PATHS
                      >
                    | REMOVE
                }>
              | SET<ValidValue<ATTRIBUTE['elements']>[]>
              | APPEND<
                  // Not using Reference<...> for improved type display
                  | GET<
                      [
                        ref: SCHEMA_ATTRIBUTE_PATHS,
                        fallback?:
                          | ValidValue<ATTRIBUTE['elements']>[]
                          | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                      ]
                    >
                  | ValidValue<ATTRIBUTE['elements']>[]
                >
              | PREPEND<
                  | GET<
                      [
                        ref: SCHEMA_ATTRIBUTE_PATHS,
                        fallback?:
                          | ValidValue<ATTRIBUTE['elements']>[]
                          | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                      ]
                    >
                  | ValidValue<ATTRIBUTE['elements']>[]
                >
          : never)
      | (ATTRIBUTE extends MapAttribute
          ?
              | Basic<
                  Optional<
                    {
                      [KEY in keyof ATTRIBUTE['attributes']]: AttributeUpdateItemInput<
                        ATTRIBUTE['attributes'][KEY],
                        FILLED,
                        SCHEMA_ATTRIBUTE_PATHS
                      >
                    },
                    OptionalKeys<ATTRIBUTE, FILLED>
                  >
                >
              | SET<ValidValue<ATTRIBUTE, { defined: true }>>
          : never)
      | (ATTRIBUTE extends RecordAttribute
          ?
              | Basic<{
                  [KEY in ResolveStringAttribute<ATTRIBUTE['keys']>]?:
                    | AttributeUpdateItemInput<
                        ATTRIBUTE['elements'],
                        FILLED,
                        SCHEMA_ATTRIBUTE_PATHS
                      >
                    | REMOVE
                }>
              | SET<ValidValue<ATTRIBUTE, { defined: true }>>
          : never)
      | (ATTRIBUTE extends AnyOfAttribute
          ? AttributeUpdateItemInput<ATTRIBUTE['elements'][number], FILLED, SCHEMA_ATTRIBUTE_PATHS>
          : never)
