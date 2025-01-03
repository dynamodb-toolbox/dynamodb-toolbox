import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  Attribute,
  AttributeValue,
  Item,
  ListAttribute,
  MapAttribute,
  Never,
  NumberAttribute,
  NumberAttributeValue,
  PrimitiveAttribute,
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
import type { Paths, Schema, ValidValue } from '~/schema/index.js'
import type { If } from '~/types/if.js'
import type { Optional } from '~/types/optional.js'

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
      ? Optional<
          {
            [KEY in keyof SCHEMA['attributes']]: UpdateAttributeInput<
              SCHEMA['attributes'][KEY],
              FILLED,
              Paths<SCHEMA>
            >
          },
          OptionalKeys<SCHEMA, FILLED>
        >
      : SCHEMA extends Entity
        ? UpdateAttributesInput<SCHEMA['schema'], FILLED>
        : never

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
              | Basic<ValidValue<ATTRIBUTE['elements']>[]>
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
      | (ATTRIBUTE extends MapAttribute ? Basic<ValidValue<ATTRIBUTE>> : never)
      | (ATTRIBUTE extends RecordAttribute ? Basic<ValidValue<ATTRIBUTE>> : never)
      | (ATTRIBUTE extends AnyOfAttribute
          ? UpdateAttributeInput<ATTRIBUTE['elements'][number], FILLED, SCHEMA_ATTRIBUTE_PATHS>
          : never)
