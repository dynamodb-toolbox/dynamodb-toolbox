import type {
  Always,
  AnyOfSchema,
  AnySchema,
  AttrSchema,
  ItemBasicValue,
  ItemSchema,
  ListSchema,
  MapSchema,
  Never,
  NumberExtendedValue,
  NumberSchema,
  PrimitiveSchema,
  RecordSchema,
  ResolveAnySchema,
  ResolvePrimitiveSchema,
  SchemaExtendedValue,
  SetExtendedValue,
  SetSchema
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
import type { Paths, ValidValue } from '~/schema/index.js'
import type { Extends, If, Not, Optional } from '~/types/index.js'

export type UpdateAttributesInputExtension =
  | ReferenceExtension
  | { type: '*'; value: Extension<{ [$REMOVE]: true }> }
  | {
      type: 'number'
      value:
        | Extension<{ [$ADD]: number }>
        | Extension<{
            [$SUM]: [
              NumberExtendedValue<ReferenceExtension>,
              NumberExtendedValue<ReferenceExtension>
            ]
          }>
        | Extension<{
            [$SUBTRACT]: [
              NumberExtendedValue<ReferenceExtension>,
              NumberExtendedValue<ReferenceExtension>
            ]
          }>
    }
  | {
      type: 'set'
      value: Extension<{ [$ADD]: SetExtendedValue } | { [$DELETE]: SetExtendedValue }>
    }
  | {
      type: 'list'
      value: Extension<
        | { [$APPEND]: SchemaExtendedValue<ReferenceExtension> | SchemaExtendedValue[] }
        | { [$PREPEND]: SchemaExtendedValue<ReferenceExtension> | SchemaExtendedValue[] }
        // TODO: CONCAT to join two unrelated lists
      >
    }

type MustBeDefined<SCHEMA extends AttrSchema, FILLED extends boolean = false> = If<
  FILLED,
  Extends<SCHEMA['props'], { required: Always }>,
  If<
    Not<Extends<SCHEMA['props'], { required: Always }>>,
    false,
    If<
      Extends<SCHEMA['props'], { key: true }>,
      Not<Extends<SCHEMA['props'], { keyDefault: unknown } | { keyLink: unknown }>>,
      Not<Extends<SCHEMA['props'], { updateDefault: unknown } | { updateLink: unknown }>>
    >
  >
>

type OptionalKeys<SCHEMA extends ItemSchema | MapSchema, FILLED extends boolean = false> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeDefined<SCHEMA['attributes'][KEY], FILLED>,
    never,
    KEY
  >
}[keyof SCHEMA['attributes']]

type CanBeRemoved<SCHEMA extends AttrSchema> = SCHEMA['props'] extends { required: Never }
  ? true
  : false

export type UpdateAttributesInput<
  SCHEMA extends Entity | ItemSchema = Entity,
  FILLED extends boolean = false
> = Entity extends SCHEMA
  ? ItemBasicValue<UpdateAttributesInputExtension>
  : ItemSchema extends SCHEMA
    ? ItemBasicValue<UpdateAttributesInputExtension>
    : SCHEMA extends ItemSchema
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

type NumberUpdate<SCHEMA extends NumberSchema> =
  | number
  | (SCHEMA['props'] extends { big: true } ? bigint : never)

/**
 * User input of an UPDATE command for a given AttrSchema
 *
 * @param AttrSchema AttrSchema
 * @param RequireDefaults Boolean
 * @return Any
 */
export type UpdateAttributeInput<
  SCHEMA extends AttrSchema = AttrSchema,
  FILLED extends boolean = false,
  AVAILABLE_PATHS extends string = string
> = AttrSchema extends SCHEMA
  ? SchemaExtendedValue<UpdateAttributesInputExtension> | undefined
  :
      | If<MustBeDefined<SCHEMA, FILLED>, never, undefined>
      | If<CanBeRemoved<SCHEMA>, REMOVE, never>
      // Not using Reference<...> for improved type display
      | GET<
          [
            ref: AVAILABLE_PATHS,
            fallback?: ValidValue<SCHEMA, { defined: true }> | Reference<SCHEMA, AVAILABLE_PATHS>
          ]
        >
      | (SCHEMA extends AnySchema ? ResolveAnySchema<SCHEMA> | unknown : never)
      | (SCHEMA extends PrimitiveSchema ? ResolvePrimitiveSchema<SCHEMA> : never)
      | (SCHEMA extends NumberSchema
          ?
              | ADD<NumberUpdate<SCHEMA>>
              | SUM<
                  // Not using Reference<...> for improved type display
                  | NumberUpdate<SCHEMA>
                  | GET<
                      [
                        ref: AVAILABLE_PATHS,
                        fallback?: NumberUpdate<SCHEMA> | Reference<SCHEMA, AVAILABLE_PATHS>
                      ]
                    >,
                  // Not using Reference<...> for improved type display
                  | NumberUpdate<SCHEMA>
                  | GET<
                      [
                        ref: AVAILABLE_PATHS,
                        fallback?: NumberUpdate<SCHEMA> | Reference<SCHEMA, AVAILABLE_PATHS>
                      ]
                    >
                >
              | SUBTRACT<
                  // Not using Reference<...> for improved type display
                  | NumberUpdate<SCHEMA>
                  | GET<
                      [
                        ref: AVAILABLE_PATHS,
                        fallback?: NumberUpdate<SCHEMA> | Reference<SCHEMA, AVAILABLE_PATHS>
                      ]
                    >,
                  // Not using Reference<...> for improved type display
                  | NumberUpdate<SCHEMA>
                  | GET<
                      [
                        ref: AVAILABLE_PATHS,
                        fallback?: NumberUpdate<SCHEMA> | Reference<SCHEMA, AVAILABLE_PATHS>
                      ]
                    >
                >
          : never)
      | (SCHEMA extends SetSchema
          ?
              | Set<ValidValue<SCHEMA['elements']>>
              | ADD<Set<ValidValue<SCHEMA['elements']>>>
              | DELETE<Set<ValidValue<SCHEMA['elements']>>>
          : never)
      | (SCHEMA extends ListSchema
          ?
              | Basic<ValidValue<SCHEMA['elements']>[]>
              | APPEND<
                  // Not using Reference<...> for improved type display
                  | GET<
                      [
                        ref: AVAILABLE_PATHS,
                        fallback?:
                          | ValidValue<SCHEMA['elements']>[]
                          | Reference<SCHEMA, AVAILABLE_PATHS>
                      ]
                    >
                  | ValidValue<SCHEMA['elements']>[]
                >
              | PREPEND<
                  | GET<
                      [
                        ref: AVAILABLE_PATHS,
                        fallback?:
                          | ValidValue<SCHEMA['elements']>[]
                          | Reference<SCHEMA, AVAILABLE_PATHS>
                      ]
                    >
                  | ValidValue<SCHEMA['elements']>[]
                >
          : never)
      | (SCHEMA extends MapSchema ? Basic<ValidValue<SCHEMA>> : never)
      | (SCHEMA extends RecordSchema ? Basic<ValidValue<SCHEMA>> : never)
      | (SCHEMA extends AnyOfSchema
          ? UpdateAttributeInput<SCHEMA['elements'][number], FILLED, AVAILABLE_PATHS>
          : never)
