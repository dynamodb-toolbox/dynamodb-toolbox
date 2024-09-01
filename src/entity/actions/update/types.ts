import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  AttributeValue,
  Item,
  ListAttribute,
  ListAttributeValue,
  MapAttribute,
  MapAttributeValue,
  Never,
  PrimitiveAttribute,
  PrimitiveAttributeValue,
  RecordAttribute,
  RecordAttributeValue,
  ResolveAnyAttribute,
  ResolvePrimitiveAttribute,
  SetAttribute,
  SetAttributeValue
} from '~/attributes/index.js'
import type { Entity } from '~/entity/index.js'
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
  | { type: '*'; value: $REMOVE }
  | {
      type: 'number'
      value:
        | Extension<{ [$ADD]: number }>
        | Extension<{
            [$SUM]: [
              PrimitiveAttributeValue<ReferenceExtension>,
              PrimitiveAttributeValue<ReferenceExtension>
            ]
          }>
        | Extension<{
            [$SUBTRACT]: [
              PrimitiveAttributeValue<ReferenceExtension>,
              PrimitiveAttributeValue<ReferenceExtension>
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
  REQUIRE_DEFAULTS extends boolean = false
> = REQUIRE_DEFAULTS extends false
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
 * @param RequireDefaults Boolean
 * @return Object
 */
export type UpdateItemInput<
  SCHEMA extends Entity | Schema = Entity,
  REQUIRE_DEFAULTS extends boolean = false
> = Entity extends SCHEMA
  ? Item<UpdateItemInputExtension>
  : Schema extends SCHEMA
    ? Item<UpdateItemInputExtension>
    : SCHEMA extends Schema
      ? OptionalizeUndefinableProperties<
          {
            [KEY in keyof SCHEMA['attributes']]: AttributeUpdateItemInput<
              SCHEMA['attributes'][KEY],
              REQUIRE_DEFAULTS,
              Paths<SCHEMA>
            >
          },
          // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
          SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: AtLeastOnce | Never }>
        >
      : SCHEMA extends Entity
        ? UpdateItemInput<SCHEMA['schema'], REQUIRE_DEFAULTS>
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
                      SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
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
 * @param RequireDefaults Boolean
 * @return Any
 */
export type AttributeUpdateItemInput<
  ATTRIBUTE extends Attribute = Attribute,
  REQUIRE_DEFAULTS extends boolean = false,
  SCHEMA_ATTRIBUTE_PATHS extends string = string
> = Attribute extends ATTRIBUTE
  ? AttributeValue<UpdateItemInputExtension> | undefined
  :
      | If<MustBeDefined<ATTRIBUTE, REQUIRE_DEFAULTS>, never, undefined>
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
                    | Basic<{
                        [INDEX in number]?:
                          | AttributeUpdateItemInput<
                              ATTRIBUTE['elements'],
                              REQUIRE_DEFAULTS,
                              SCHEMA_ATTRIBUTE_PATHS
                            >
                          | $REMOVE
                      }>
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
                      | Basic<
                          OptionalizeUndefinableProperties<
                            {
                              [KEY in keyof ATTRIBUTE['attributes']]: AttributeUpdateItemInput<
                                ATTRIBUTE['attributes'][KEY],
                                REQUIRE_DEFAULTS,
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
                      | SET<AttributeUpdateItemCompleteInput<ATTRIBUTE>>
                  : ATTRIBUTE extends RecordAttribute
                    ?
                        | Basic<{
                            [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?:
                              | AttributeUpdateItemInput<
                                  ATTRIBUTE['elements'],
                                  REQUIRE_DEFAULTS,
                                  SCHEMA_ATTRIBUTE_PATHS
                                >
                              | $REMOVE
                          }>
                        | SET<AttributeUpdateItemCompleteInput<ATTRIBUTE>>
                    : ATTRIBUTE extends AnyOfAttribute
                      ? AttributeUpdateItemInput<
                          ATTRIBUTE['elements'][number],
                          REQUIRE_DEFAULTS,
                          SCHEMA_ATTRIBUTE_PATHS
                        >
                      : never)
