import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  AttributeValue,
  BinaryAttribute,
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
  ResolveBinaryAttribute,
  ResolveNumberAttribute,
  ResolvePrimitiveAttribute,
  ResolveStringAttribute,
  SetAttribute,
  SetAttributeValue,
  StringAttribute
} from '~/attributes/index.js'
import type { Entity } from '~/entity/index.js'
import type { AttrParserInput } from '~/schema/actions/parse/index.js'
import type { Paths } from '~/schema/actions/parsePaths/index.js'
import type { Schema } from '~/schema/index.js'
import type { If } from '~/types/if.js'
import type { OptionalizeUndefinableProperties } from '~/types/optionalizeUndefinableProperties.js'
import type { SelectKeys } from '~/types/selectKeys.js'

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
      ? OptionalizeUndefinableProperties<
          {
            [KEY in keyof SCHEMA['attributes']]: AttributeUpdateItemInput<
              SCHEMA['attributes'][KEY],
              FILLED,
              Paths<SCHEMA>
            >
          },
          // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
          SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: AtLeastOnce | Never }>
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
      | AttrParserInput<ATTRIBUTE, { defined: true; fill: false }>
      | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
  ]
>

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
              | AttrParserInput<ATTRIBUTE, { defined: true; fill: false }>
              | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
          ]
        >
      | (ATTRIBUTE extends AnyAttribute
          ? ResolveAnyAttribute<ATTRIBUTE> | unknown
          : ATTRIBUTE extends PrimitiveAttribute
            ? ResolvePrimitiveAttribute<ATTRIBUTE>
            : ATTRIBUTE extends StringAttribute
              ? ResolveStringAttribute<ATTRIBUTE>
              : ATTRIBUTE extends NumberAttribute
                ?
                    | ResolveNumberAttribute<ATTRIBUTE>
                    | ADD<number>
                    | SUM<
                        // Not using Reference<...> for improved type display
                        | number
                        | GET<
                            [
                              ref: SCHEMA_ATTRIBUTE_PATHS,
                              fallback?: number | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                            ]
                          >,
                        // Not using Reference<...> for improved type display
                        | number
                        | GET<
                            [
                              ref: SCHEMA_ATTRIBUTE_PATHS,
                              fallback?: number | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                            ]
                          >
                      >
                    | SUBTRACT<
                        // Not using Reference<...> for improved type display
                        | number
                        | GET<
                            [
                              ref: SCHEMA_ATTRIBUTE_PATHS,
                              fallback?: number | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                            ]
                          >,
                        // Not using Reference<...> for improved type display
                        | number
                        | GET<
                            [
                              ref: SCHEMA_ATTRIBUTE_PATHS,
                              fallback?: number | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                            ]
                          >
                      >
                : ATTRIBUTE extends BinaryAttribute
                  ? ResolveBinaryAttribute<ATTRIBUTE>
                  : ATTRIBUTE extends SetAttribute
                    ?
                        | Set<AttrParserInput<ATTRIBUTE['elements']>>
                        | ADD<Set<AttrParserInput<ATTRIBUTE['elements']>>>
                        | DELETE<Set<AttrParserInput<ATTRIBUTE['elements']>>>
                    : ATTRIBUTE extends ListAttribute
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
                          | SET<AttrParserInput<ATTRIBUTE['elements']>[]>
                          | APPEND<
                              // Not using Reference<...> for improved type display
                              | GET<
                                  [
                                    ref: SCHEMA_ATTRIBUTE_PATHS,
                                    fallback?:
                                      | AttrParserInput<ATTRIBUTE['elements']>[]
                                      | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                                  ]
                                >
                              | AttrParserInput<ATTRIBUTE['elements']>[]
                            >
                          | PREPEND<
                              | GET<
                                  [
                                    ref: SCHEMA_ATTRIBUTE_PATHS,
                                    fallback?:
                                      | AttrParserInput<ATTRIBUTE['elements']>[]
                                      | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                                  ]
                                >
                              | AttrParserInput<ATTRIBUTE['elements']>[]
                            >
                      : ATTRIBUTE extends MapAttribute
                        ?
                            | Basic<
                                OptionalizeUndefinableProperties<
                                  {
                                    [KEY in keyof ATTRIBUTE['attributes']]: AttributeUpdateItemInput<
                                      ATTRIBUTE['attributes'][KEY],
                                      FILLED,
                                      SCHEMA_ATTRIBUTE_PATHS
                                    >
                                  },
                                  // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
                                  SelectKeys<
                                    ATTRIBUTE['attributes'],
                                    AnyAttribute & { required: AtLeastOnce | Never }
                                  >
                                >
                              >
                            | SET<AttrParserInput<ATTRIBUTE, { defined: true; fill: false }>>
                        : ATTRIBUTE extends RecordAttribute
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
                              | SET<AttrParserInput<ATTRIBUTE, { defined: true; fill: false }>>
                          : ATTRIBUTE extends AnyOfAttribute
                            ? AttributeUpdateItemInput<
                                ATTRIBUTE['elements'][number],
                                FILLED,
                                SCHEMA_ATTRIBUTE_PATHS
                              >
                            : never)
