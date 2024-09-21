import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  AttributeValue,
  BinaryAttribute,
  BooleanAttribute,
  Item,
  ListAttribute,
  MapAttribute,
  Never,
  NullAttribute,
  NumberAttribute,
  NumberAttributeValue,
  RecordAttribute,
  ResolveAnyAttribute,
  ResolveBinaryAttribute,
  ResolveBooleanAttribute,
  ResolveNullAttribute,
  ResolveNumberAttribute,
  ResolveStringAttribute,
  SetAttribute,
  SetAttributeValue,
  StringAttribute
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
import type { AttrParserInput } from '~/schema/actions/parse/index.js'
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
      value: Extension<
        | { [$APPEND]: AttributeValue<ReferenceExtension> | AttributeValue[] }
        | { [$PREPEND]: AttributeValue<ReferenceExtension> | AttributeValue[] }
        // TODO: CONCAT to join two unrelated lists
      >
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
 * User input of an UPDATE_ATTRIBUTES command for a given Entity or Schema
 *
 * @param Schema Entity | Schema
 * @param RequireDefaults Boolean
 * @return Object
 */
export type UpdateAttributesInput<
  SCHEMA extends Entity | Schema = Entity,
  FILLED extends boolean = false
> = Entity extends SCHEMA
  ? Item<UpdateAttributesInputExtension>
  : Schema extends SCHEMA
    ? Item<UpdateAttributesInputExtension>
    : SCHEMA extends Schema
      ? OptionalizeUndefinableProperties<
          {
            [KEY in keyof SCHEMA['attributes']]: UpdateAttributeInput<
              SCHEMA['attributes'][KEY],
              FILLED,
              Paths<SCHEMA>
            >
          },
          // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
          SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: AtLeastOnce | Never }>
        >
      : SCHEMA extends Entity
        ? UpdateAttributesInput<SCHEMA['schema'], FILLED>
        : never

/**
 * User input of an UPDATE command for a given Attribute
 *
 * @param Attribute Attribute
 * @param RequireDefaults Boolean
 * @return Any
 */
export type UpdateAttributeInput<
  ATTRIBUTE extends Attribute = Attribute,
  FILLED extends boolean = false,
  SCHEMA_ATTRIBUTE_PATHS extends string = string
> = Attribute extends ATTRIBUTE
  ? AttributeValue<UpdateAttributesInputExtension> | undefined
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
          : ATTRIBUTE extends NullAttribute
            ? ResolveNullAttribute<ATTRIBUTE>
            : ATTRIBUTE extends BooleanAttribute
              ? ResolveBooleanAttribute<ATTRIBUTE>
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
                            | Basic<AttrParserInput<ATTRIBUTE['elements']>[]>
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
                          ? Basic<AttrParserInput<ATTRIBUTE, { defined: true; fill: false }>>
                          : ATTRIBUTE extends RecordAttribute
                            ? Basic<AttrParserInput<ATTRIBUTE, { defined: true; fill: false }>>
                            : ATTRIBUTE extends AnyOfAttribute
                              ? UpdateAttributeInput<
                                  ATTRIBUTE['elements'][number],
                                  FILLED,
                                  SCHEMA_ATTRIBUTE_PATHS
                                >
                              : never)
