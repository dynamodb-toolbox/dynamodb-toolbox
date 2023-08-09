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
import type { SchemaAttributePath } from 'v1/commands/types'

import {
  $HAS_VERB,
  $SET,
  $GET,
  $REMOVE,
  $SUM,
  $SUBTRACT,
  $ADD,
  $DELETE,
  $APPEND,
  $PREPEND
} from './constants'

// Distinguishing verbal syntax vs non-verbal for type inference & parsing
export type Verbal<VALUE> = { [$HAS_VERB]: true } & VALUE

export type ADD<VALUE> = Verbal<{ [$ADD]: VALUE }>
export type SET<VALUE> = Verbal<{ [$SET]: VALUE }>
export type GET<VALUE> = Verbal<{ [$GET]: VALUE }>
export type SUM<A, B> = Verbal<{ [$SUM]: [A, B] }>
export type SUBTRACT<A, B> = Verbal<{ [$SUBTRACT]: [A, B] }>
export type DELETE<VALUE> = Verbal<{ [$DELETE]: VALUE }>
export type APPEND<VALUE> = Verbal<{ [$APPEND]: VALUE }>
export type PREPEND<VALUE> = Verbal<{ [$PREPEND]: VALUE }>

export type NonVerbal<VALUE> = { [$HAS_VERB]?: false } & VALUE

export type ReferenceExtension = {
  type: '*'
  value: Verbal<{ [$GET]: [ref: string, fallback?: AttributeValue<ReferenceExtension>] }>
}

export type UpdateItemInputExtension =
  | ReferenceExtension
  | { type: '*'; value: $REMOVE }
  | {
      type: 'number'
      value:
        | Verbal<{ [$ADD]: number }>
        | Verbal<{
            [$SUM]: [AttributeValue<ReferenceExtension>, AttributeValue<ReferenceExtension>]
          }>
        | Verbal<{
            [$SUBTRACT]: [AttributeValue<ReferenceExtension>, AttributeValue<ReferenceExtension>]
          }>
    }
  | {
      type: 'set'
      value: Verbal<
        | { [$ADD]: AttributeValue<UpdateItemInputExtension> }
        | { [$DELETE]: AttributeValue<UpdateItemInputExtension> }
      >
    }
  | {
      type: 'list'
      value:
        | NonVerbal<{ [INDEX in number]: AttributeValue<UpdateItemInputExtension> }>
        | Verbal<{ [$SET]: AttributeValue<UpdateItemInputExtension>[] }>
        | Verbal<
            | { [$APPEND]: AttributeValue<UpdateItemInputExtension>[] }
            | { [$PREPEND]: AttributeValue<UpdateItemInputExtension>[] }
            // TODO: CONCAT to join two unrelated lists
          >
    }
  | {
      type: 'map'
      value: Verbal<{ [$SET]: AttributeValue<UpdateItemInputExtension> }>
    }
  | {
      type: 'record'
      value: Verbal<{ [$SET]: AttributeValue<UpdateItemInputExtension> }>
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
  SCHEMA extends EntityV2 | Schema = EntityV2,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false
> = EntityV2 extends SCHEMA
  ? Item<UpdateItemInputExtension>
  : Schema extends SCHEMA
  ? Item<UpdateItemInputExtension>
  : SCHEMA extends Schema
  ? OptionalizeUndefinableProperties<
      {
        [KEY in keyof SCHEMA['attributes']]: UpdateAttributeInput<
          SCHEMA['attributes'][KEY],
          REQUIRE_INDEPENDENT_DEFAULTS,
          SchemaAttributePath<SCHEMA>
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: AtLeastOnce | Never }>
    >
  : SCHEMA extends EntityV2
  ? UpdateItemInput<SCHEMA['schema'], REQUIRE_INDEPENDENT_DEFAULTS>
  : never

export type Reference<
  ATTRIBUTE extends Attribute,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false,
  ATTRIBUTE_PATH extends string = string
> = GET<
  [
    ref: ATTRIBUTE_PATH,
    fallback?:
      | AttributePutItemInput<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS>
      | Reference<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS, ATTRIBUTE_PATH>
  ]
>

/**
 * User input of an UPDATE command for a given Attribute
 *
 * @param Attribute Attribute
 * @param RequireIndependentDefaults Boolean
 * @return Any
 */
export type UpdateAttributeInput<
  ATTRIBUTE extends Attribute = Attribute,
  REQUIRE_INDEPENDENT_DEFAULTS extends boolean = false,
  ATTRIBUTE_PATH extends string = string
> = Attribute extends ATTRIBUTE
  ? AttributeValue<UpdateItemInputExtension> | undefined
  :
      | If<MustBeDefined<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS>, never, undefined>
      | If<CanBeRemoved<ATTRIBUTE>, $REMOVE, never>
      // Not using Reference<...> for improved type display
      | GET<
          [
            ref: ATTRIBUTE_PATH,
            fallback?:
              | AttributePutItemInput<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS>
              | Reference<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS, ATTRIBUTE_PATH>
          ]
        >
      | (ATTRIBUTE extends AnyAttribute
          ? unknown
          : ATTRIBUTE extends PrimitiveAttribute
          ?
              | ResolvePrimitiveAttribute<ATTRIBUTE>
              | (ATTRIBUTE extends PrimitiveAttribute<'number'>
                  ?
                      | ADD<number>
                      | SUM<
                          // Not using Reference<...> for improved type display
                          | number
                          | GET<
                              [
                                ref: ATTRIBUTE_PATH,
                                fallback?:
                                  | number
                                  | Reference<
                                      ATTRIBUTE,
                                      REQUIRE_INDEPENDENT_DEFAULTS,
                                      ATTRIBUTE_PATH
                                    >
                              ]
                            >,
                          // Not using Reference<...> for improved type display
                          | number
                          | GET<
                              [
                                ref: ATTRIBUTE_PATH,
                                fallback?:
                                  | number
                                  | Reference<
                                      ATTRIBUTE,
                                      REQUIRE_INDEPENDENT_DEFAULTS,
                                      ATTRIBUTE_PATH
                                    >
                              ]
                            >
                        >
                      | SUBTRACT<
                          // Not using Reference<...> for improved type display
                          | number
                          | GET<
                              [
                                ref: ATTRIBUTE_PATH,
                                fallback?:
                                  | number
                                  | Reference<
                                      ATTRIBUTE,
                                      REQUIRE_INDEPENDENT_DEFAULTS,
                                      ATTRIBUTE_PATH
                                    >
                              ]
                            >,
                          // Not using Reference<...> for improved type display
                          | number
                          | GET<
                              [
                                ref: ATTRIBUTE_PATH,
                                fallback?:
                                  | number
                                  | Reference<
                                      ATTRIBUTE,
                                      REQUIRE_INDEPENDENT_DEFAULTS,
                                      ATTRIBUTE_PATH
                                    >
                              ]
                            >
                        >
                  : never)
          : ATTRIBUTE extends SetAttribute
          ?
              | Set<AttributePutItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>>
              | ADD<Set<AttributePutItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>>>
              | DELETE<
                  Set<AttributePutItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>>
                >
          : ATTRIBUTE extends ListAttribute
          ?
              | NonVerbal<
                  {
                    [INDEX in number]?:
                      | UpdateAttributeInput<
                          ATTRIBUTE['elements'],
                          REQUIRE_INDEPENDENT_DEFAULTS,
                          ATTRIBUTE_PATH
                        >
                      | $REMOVE
                  }
                >
              | SET<AttributePutItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>[]>
              | APPEND<
                  (
                    | // Not using Reference<...> for improved type display
                    GET<
                        [
                          ref: ATTRIBUTE_PATH,
                          fallback?:
                            | AttributePutItemInput<
                                ATTRIBUTE['elements'],
                                REQUIRE_INDEPENDENT_DEFAULTS
                              >
                            | Reference<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS, ATTRIBUTE_PATH>
                        ]
                      >
                    | AttributePutItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>
                  )[]
                >
              | PREPEND<
                  (
                    | // Not using Reference<...> for improved type display
                    GET<
                        [
                          ref: ATTRIBUTE_PATH,
                          fallback?:
                            | AttributePutItemInput<
                                ATTRIBUTE['elements'],
                                REQUIRE_INDEPENDENT_DEFAULTS
                              >
                            | Reference<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS, ATTRIBUTE_PATH>
                        ]
                      >
                    | AttributePutItemInput<ATTRIBUTE['elements'], REQUIRE_INDEPENDENT_DEFAULTS>
                  )[]
                >
          : ATTRIBUTE extends MapAttribute
          ?
              | NonVerbal<
                  OptionalizeUndefinableProperties<
                    {
                      [KEY in keyof ATTRIBUTE['attributes']]: UpdateAttributeInput<
                        ATTRIBUTE['attributes'][KEY],
                        REQUIRE_INDEPENDENT_DEFAULTS,
                        ATTRIBUTE_PATH
                      >
                    },
                    // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
                    O.SelectKeys<
                      ATTRIBUTE['attributes'],
                      AnyAttribute & { required: AtLeastOnce | Never }
                    >
                  >
                >
              | SET<AttributePutItemInput<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS>>
          : ATTRIBUTE extends RecordAttribute
          ?
              | NonVerbal<
                  {
                    [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?:
                      | UpdateAttributeInput<
                          ATTRIBUTE['elements'],
                          REQUIRE_INDEPENDENT_DEFAULTS,
                          ATTRIBUTE_PATH
                        >
                      | $REMOVE
                  }
                >
              | SET<AttributePutItemInput<ATTRIBUTE, REQUIRE_INDEPENDENT_DEFAULTS>>
          : ATTRIBUTE extends AnyOfAttribute
          ? UpdateAttributeInput<
              ATTRIBUTE['elements'][number],
              REQUIRE_INDEPENDENT_DEFAULTS,
              ATTRIBUTE_PATH
            >
          : never)
