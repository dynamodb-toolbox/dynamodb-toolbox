import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  AttributeValue,
  Item,
  ListAttribute,
  MapAttribute,
  Never,
  PrimitiveAttribute,
  PrimitiveAttributeValue,
  RecordAttribute,
  ResolveAnyAttribute,
  ResolvePrimitiveAttribute,
  SetAttribute,
  SetAttributeValue
} from '~/attributes/index.js'
import type {
  $ADD,
  $APPEND,
  $DELETE,
  $PREPEND,
  $REMOVE,
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
  SUBTRACT,
  SUM
} from '~/entity/actions/update/symbols/index.js'
import type { Reference, ReferenceExtension } from '~/entity/actions/update/types.js'
import type { Entity } from '~/entity/index.js'
import type { Paths } from '~/schema/actions/parsePaths/index.js'
import type { Schema } from '~/schema/index.js'
import type { If } from '~/types/if.js'
import type { OptionalizeUndefinableProperties } from '~/types/optionalizeUndefinableProperties.js'
import type { SelectKeys } from '~/types/selectKeys.js'

export type UpdateAttributesInputExtension =
  | ReferenceExtension
  | { type: '*'; value: Extension<{ [$REMOVE]: true }> }
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
      value: Extension<
        | { [$APPEND]: AttributeValue<ReferenceExtension> | AttributeValue[] }
        | { [$PREPEND]: AttributeValue<ReferenceExtension> | AttributeValue[] }
        // TODO: CONCAT to join two unrelated lists
      >
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
 * User input of an UPDATE_ATTRIBUTES command for a given Entity or Schema
 *
 * @param Schema Entity | Schema
 * @param RequireDefaults Boolean
 * @return Object
 */
export type UpdateAttributesInput<
  SCHEMA extends Entity | Schema = Entity,
  REQUIRE_DEFAULTS extends boolean = false
> = Entity extends SCHEMA
  ? Item<UpdateAttributesInputExtension>
  : Schema extends SCHEMA
    ? Item<UpdateAttributesInputExtension>
    : SCHEMA extends Schema
      ? OptionalizeUndefinableProperties<
          {
            [KEY in keyof SCHEMA['attributes']]: UpdateAttributeInput<
              SCHEMA['attributes'][KEY],
              REQUIRE_DEFAULTS,
              Paths<SCHEMA>
            >
          },
          // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
          SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: AtLeastOnce | Never }>
        >
      : SCHEMA extends Entity
        ? UpdateAttributesInput<SCHEMA['schema'], REQUIRE_DEFAULTS>
        : never

type UpdateAttributeCompleteInput<ATTRIBUTE extends Attribute> = Attribute extends ATTRIBUTE
  ? AttributeValue | undefined
  :
      | (ATTRIBUTE extends { required: Never } ? undefined : never)
      | (ATTRIBUTE extends AnyAttribute
          ? ResolveAnyAttribute<ATTRIBUTE> | unknown
          : ATTRIBUTE extends PrimitiveAttribute
            ? ResolvePrimitiveAttribute<ATTRIBUTE>
            : ATTRIBUTE extends SetAttribute
              ? Set<UpdateAttributeCompleteInput<ATTRIBUTE['elements']>>
              : ATTRIBUTE extends ListAttribute
                ? UpdateAttributeCompleteInput<ATTRIBUTE['elements']>[]
                : ATTRIBUTE extends MapAttribute
                  ? OptionalizeUndefinableProperties<
                      {
                        [KEY in keyof ATTRIBUTE['attributes']]: UpdateAttributeCompleteInput<
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
                        >]?: UpdateAttributeCompleteInput<ATTRIBUTE['elements']>
                      }
                    : ATTRIBUTE extends AnyOfAttribute
                      ? UpdateAttributeCompleteInput<ATTRIBUTE['elements'][number]>
                      : never)

/**
 * User input of an UPDATE command for a given Attribute
 *
 * @param Attribute Attribute
 * @param RequireDefaults Boolean
 * @return Any
 */
export type UpdateAttributeInput<
  ATTRIBUTE extends Attribute = Attribute,
  REQUIRE_DEFAULTS extends boolean = false,
  SCHEMA_ATTRIBUTE_PATHS extends string = string
> = Attribute extends ATTRIBUTE
  ? AttributeValue<UpdateAttributesInputExtension> | undefined
  :
      | If<MustBeDefined<ATTRIBUTE, REQUIRE_DEFAULTS>, never, undefined>
      | If<CanBeRemoved<ATTRIBUTE>, REMOVE, never>
      // Not using Reference<...> for improved type display
      | GET<
          [
            ref: SCHEMA_ATTRIBUTE_PATHS,
            fallback?:
              | UpdateAttributeCompleteInput<ATTRIBUTE>
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
                  | Set<UpdateAttributeCompleteInput<ATTRIBUTE['elements']>>
                  | ADD<Set<UpdateAttributeCompleteInput<ATTRIBUTE['elements']>>>
                  | DELETE<Set<UpdateAttributeCompleteInput<ATTRIBUTE['elements']>>>
              : ATTRIBUTE extends ListAttribute
                ?
                    | Basic<UpdateAttributeCompleteInput<ATTRIBUTE['elements']>[]>
                    | APPEND<
                        // Not using Reference<...> for improved type display
                        | GET<
                            [
                              ref: SCHEMA_ATTRIBUTE_PATHS,
                              fallback?:
                                | UpdateAttributeCompleteInput<ATTRIBUTE['elements']>[]
                                | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                            ]
                          >
                        | UpdateAttributeCompleteInput<ATTRIBUTE['elements']>[]
                      >
                    | PREPEND<
                        | GET<
                            [
                              ref: SCHEMA_ATTRIBUTE_PATHS,
                              fallback?:
                                | UpdateAttributeCompleteInput<ATTRIBUTE['elements']>[]
                                | Reference<ATTRIBUTE, SCHEMA_ATTRIBUTE_PATHS>
                            ]
                          >
                        | UpdateAttributeCompleteInput<ATTRIBUTE['elements']>[]
                      >
                : ATTRIBUTE extends MapAttribute
                  ? Basic<UpdateAttributeCompleteInput<ATTRIBUTE>>
                  : ATTRIBUTE extends RecordAttribute
                    ? Basic<UpdateAttributeCompleteInput<ATTRIBUTE>>
                    : ATTRIBUTE extends AnyOfAttribute
                      ? UpdateAttributeInput<
                          ATTRIBUTE['elements'][number],
                          REQUIRE_DEFAULTS,
                          SCHEMA_ATTRIBUTE_PATHS
                        >
                      : never)
