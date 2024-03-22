import type { O } from 'ts-toolbelt'

import type { Schema } from 'v1/schema'
import type {
  Attribute,
  AttributeValue,
  ResolveAnyAttribute,
  ResolvePrimitiveAttribute,
  Item,
  AnyAttribute,
  PrimitiveAttribute,
  PrimitiveAttributeValue,
  SetAttribute,
  SetAttributeValue,
  ListAttribute,
  ListAttributeValue,
  MapAttribute,
  MapAttributeValue,
  RecordAttribute,
  RecordAttributeValue,
  AnyOfAttribute,
  AtLeastOnce,
  Always,
  Never
} from 'v1/schema/attributes'
import type { OptionalizeUndefinableProperties } from 'v1/types/optionalizeUndefinableProperties'
import type { EntityV2 } from 'v1/entity'
import type { If } from 'v1/types/if'
import type { Paths } from 'v1/schema/actions/paths'

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
            [$SUM]: [
              PrimitiveAttributeValue<ReferenceExtension>,
              PrimitiveAttributeValue<ReferenceExtension>
            ]
          }>
        | Verbal<{
            [$SUBTRACT]: [
              PrimitiveAttributeValue<ReferenceExtension>,
              PrimitiveAttributeValue<ReferenceExtension>
            ]
          }>
    }
  | {
      type: 'set'
      value: Verbal<{ [$ADD]: SetAttributeValue } | { [$DELETE]: SetAttributeValue }>
    }
  | {
      type: 'list'
      value:
        | NonVerbal<{ [INDEX in number]: AttributeValue<UpdateItemInputExtension> | undefined }>
        | Verbal<{ [$SET]: ListAttributeValue }>
        | Verbal<
            | { [$APPEND]: AttributeValue<ReferenceExtension> | AttributeValue[] }
            | { [$PREPEND]: AttributeValue<ReferenceExtension> | AttributeValue[] }
            // TODO: CONCAT to join two unrelated lists
          >
    }
  | {
      type: 'map'
      value: Verbal<{ [$SET]: MapAttributeValue }>
    }
  | {
      type: 'record'
      value: Verbal<{ [$SET]: RecordAttributeValue }>
    }

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  REQUIRED_DEFAULTS extends boolean = false
> = REQUIRED_DEFAULTS extends false
  ? ATTRIBUTE extends { required: Always } & (
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
  : ATTRIBUTE extends { required: Always }
  ? true
  : false

type CanBeRemoved<ATTRIBUTE extends Attribute> = ATTRIBUTE extends { required: Never }
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
  REQUIRED_DEFAULTS extends boolean = false
> = EntityV2 extends SCHEMA
  ? Item<UpdateItemInputExtension>
  : Schema extends SCHEMA
  ? Item<UpdateItemInputExtension>
  : SCHEMA extends Schema
  ? OptionalizeUndefinableProperties<
      {
        [KEY in keyof SCHEMA['attributes']]: AttributeUpdateItemInput<
          SCHEMA['attributes'][KEY],
          REQUIRED_DEFAULTS,
          Paths<SCHEMA>
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: AtLeastOnce | Never }>
    >
  : SCHEMA extends EntityV2
  ? UpdateItemInput<SCHEMA['schema'], REQUIRED_DEFAULTS>
  : never

export type Reference<
  ATTRIBUTE extends Attribute,
  SCHEMA_ATTRIBUTE_PATHS extends string = string
> = GET<
  [
    ref: SCHEMA_ATTRIBUTE_PATHS,
    fallback?:
      | AttributeUpdateItemCompleteInput<ATTRIBUTE>
      | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
  ]
>

type AttributeUpdateItemCompleteInput<ATTRIBUTE extends Attribute> = Attribute extends ATTRIBUTE
  ? AttributeValue | undefined
  :
      | (ATTRIBUTE extends { required: Never } ? undefined : never)
      | (ATTRIBUTE extends AnyAttribute
          ? ResolveAnyAttribute<ATTRIBUTE> | unknown
          : ATTRIBUTE extends PrimitiveAttribute
          ? ResolvePrimitiveAttribute<ATTRIBUTE>
          : ATTRIBUTE extends SetAttribute
          ? Set<AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>>
          : ATTRIBUTE extends ListAttribute
          ? AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>[]
          : ATTRIBUTE extends MapAttribute
          ? OptionalizeUndefinableProperties<
              {
                [KEY in keyof ATTRIBUTE['attributes']]: AttributeUpdateItemCompleteInput<
                  ATTRIBUTE['attributes'][KEY]
                >
              },
              // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
              O.SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
            >
          : ATTRIBUTE extends RecordAttribute
          ? {
              [KEY in ResolvePrimitiveAttribute<
                ATTRIBUTE['keys']
              >]?: AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>
            }
          : ATTRIBUTE extends AnyOfAttribute
          ? AttributeUpdateItemCompleteInput<ATTRIBUTE['elements'][number]>
          : never)

/**
 * User input of an UPDATE command for a given Attribute
 *
 * @param Attribute Attribute
 * @param RequireIndependentDefaults Boolean
 * @return Any
 */
export type AttributeUpdateItemInput<
  ATTRIBUTE extends Attribute = Attribute,
  REQUIRED_DEFAULTS extends boolean = false,
  SCHEMA_ATTRIBUTE_PATHS extends string = string
> = Attribute extends ATTRIBUTE
  ? AttributeValue<UpdateItemInputExtension> | undefined
  :
      | If<MustBeDefined<ATTRIBUTE, REQUIRED_DEFAULTS>, never, undefined>
      | If<CanBeRemoved<ATTRIBUTE>, $REMOVE, never>
      // Not using Reference<...> for improved type display
      | GET<
          [
            ref: SCHEMA_ATTRIBUTE_PATHS,
            fallback?:
              | AttributeUpdateItemCompleteInput<ATTRIBUTE>
              | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
          ]
        >
      | (ATTRIBUTE extends AnyAttribute
          ? ResolveAnyAttribute<ATTRIBUTE> | unknown
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
                  : never)
          : ATTRIBUTE extends SetAttribute
          ?
              | Set<AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>>
              | ADD<Set<AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>>>
              | DELETE<Set<AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>>>
          : ATTRIBUTE extends ListAttribute
          ?
              | NonVerbal<
                  {
                    [INDEX in number]?:
                      | AttributeUpdateItemInput<
                          ATTRIBUTE['elements'],
                          REQUIRED_DEFAULTS,
                          SCHEMA_ATTRIBUTE_PATHS
                        >
                      | $REMOVE
                  }
                >
              | SET<AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>[]>
              | APPEND<
                  // Not using Reference<...> for improved type display
                  | GET<
                      [
                        ref: SCHEMA_ATTRIBUTE_PATHS,
                        fallback?:
                          | AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>[]
                          | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                      ]
                    >
                  | AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>[]
                >
              | PREPEND<
                  | GET<
                      [
                        ref: SCHEMA_ATTRIBUTE_PATHS,
                        fallback?:
                          | AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>[]
                          | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                      ]
                    >
                  | AttributeUpdateItemCompleteInput<ATTRIBUTE['elements']>[]
                >
          : ATTRIBUTE extends MapAttribute
          ?
              | NonVerbal<
                  OptionalizeUndefinableProperties<
                    {
                      [KEY in keyof ATTRIBUTE['attributes']]: AttributeUpdateItemInput<
                        ATTRIBUTE['attributes'][KEY],
                        REQUIRED_DEFAULTS,
                        SCHEMA_ATTRIBUTE_PATHS
                      >
                    },
                    // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
                    O.SelectKeys<
                      ATTRIBUTE['attributes'],
                      AnyAttribute & { required: AtLeastOnce | Never }
                    >
                  >
                >
              | SET<AttributeUpdateItemCompleteInput<ATTRIBUTE>>
          : ATTRIBUTE extends RecordAttribute
          ?
              | NonVerbal<
                  {
                    [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?:
                      | AttributeUpdateItemInput<
                          ATTRIBUTE['elements'],
                          REQUIRED_DEFAULTS,
                          SCHEMA_ATTRIBUTE_PATHS
                        >
                      | $REMOVE
                  }
                >
              | SET<AttributeUpdateItemCompleteInput<ATTRIBUTE>>
          : ATTRIBUTE extends AnyOfAttribute
          ? AttributeUpdateItemInput<
              ATTRIBUTE['elements'][number],
              REQUIRED_DEFAULTS,
              SCHEMA_ATTRIBUTE_PATHS
            >
          : never)
