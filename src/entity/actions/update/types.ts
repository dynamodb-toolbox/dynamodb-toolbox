import type { Entity } from '~/entity/index.js'
import type {
  Always,
  AnyOfSchema,
  AnySchema,
  ItemBasicValue,
  ItemSchema,
  ListExtendedValue,
  ListSchema,
  MapExtendedValue,
  MapSchema,
  Never,
  NumberExtendedValue,
  NumberSchema,
  PrimitiveSchema,
  RecordExtendedValue,
  RecordSchema,
  ResolveAnySchema,
  ResolvePrimitiveSchema,
  ResolveStringSchema,
  Schema,
  SchemaExtendedValue,
  SetExtendedValue,
  SetSchema
} from '~/schema/index.js'
import type { Paths, ValidValue } from '~/schema/index.js'
import type { Extends, If, Not, Optional } from '~/types/index.js'

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
  value: Extension<{ [$GET]: [ref: string, fallback?: SchemaExtendedValue<ReferenceExtension>] }>
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
      value:
        | Basic<{ [INDEX in number]: SchemaExtendedValue<UpdateItemInputExtension> | undefined }>
        | Extension<{ [$SET]: ListExtendedValue }>
        | Extension<
            | { [$APPEND]: SchemaExtendedValue<ReferenceExtension> | SchemaExtendedValue[] }
            | { [$PREPEND]: SchemaExtendedValue<ReferenceExtension> | SchemaExtendedValue[] }
            // TODO: CONCAT to join two unrelated lists
          >
    }
  | {
      type: 'map'
      value: Extension<{ [$SET]: MapExtendedValue }>
    }
  | {
      type: 'record'
      value: Extension<{ [$SET]: RecordExtendedValue }>
    }

type MustBeDefined<SCHEMA extends Schema, FILLED extends boolean = false> = If<
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

type CanBeRemoved<SCHEMA extends Schema> = Extends<SCHEMA['props'], { required: Never }>

/**
 * User input of an UPDATE command for a given Entity or Schema
 *
 * @param Schema Entity | Schema
 * @param RequireDefaults Boolean
 * @return Object
 */
export type UpdateItemInput<
  SCHEMA extends Entity = Entity,
  FILLED extends boolean = false
> = Entity extends SCHEMA
  ? ItemBasicValue<UpdateItemInputExtension>
  : AttributeUpdateItemInput<SCHEMA['schema'], FILLED>

export type Reference<SCHEMA extends Schema, AVAILABLE_PATHS extends string = string> = GET<
  [
    ref: AVAILABLE_PATHS,
    fallback?: ValidValue<SCHEMA, { defined: true }> | Reference<SCHEMA, AVAILABLE_PATHS>
  ]
>

type NumberUpdate<SCHEMA extends NumberSchema> =
  | number
  | (SCHEMA['props'] extends { big: true } ? bigint : never)

/**
 * User input of an UPDATE command for a given Schema
 *
 * @param Schema Schema
 * @param RequireDefaults Boolean
 * @return Any
 */
export type AttributeUpdateItemInput<
  SCHEMA extends Schema = Schema,
  FILLED extends boolean = false,
  AVAILABLE_PATHS extends string = string
> = Schema extends SCHEMA
  ? SchemaExtendedValue<UpdateItemInputExtension> | undefined
  : SCHEMA extends ItemSchema
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
                | Basic<{
                    [INDEX in number]?:
                      | AttributeUpdateItemInput<SCHEMA['elements'], FILLED, AVAILABLE_PATHS>
                      | REMOVE
                  }>
                | SET<ValidValue<SCHEMA['elements']>[]>
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
        | (SCHEMA extends MapSchema
            ?
                | Basic<
                    Optional<
                      {
                        [KEY in keyof SCHEMA['attributes']]: AttributeUpdateItemInput<
                          SCHEMA['attributes'][KEY],
                          FILLED,
                          AVAILABLE_PATHS
                        >
                      },
                      OptionalKeys<SCHEMA, FILLED>
                    >
                  >
                | SET<ValidValue<SCHEMA, { defined: true }>>
            : never)
        | (SCHEMA extends RecordSchema
            ?
                | Basic<{
                    [KEY in ResolveStringSchema<SCHEMA['keys']>]?:
                      | AttributeUpdateItemInput<SCHEMA['elements'], FILLED, AVAILABLE_PATHS>
                      | REMOVE
                  }>
                | SET<ValidValue<SCHEMA, { defined: true }>>
            : never)
        | (SCHEMA extends AnyOfSchema
            ? AttributeUpdateItemInput<SCHEMA['elements'][number], FILLED, AVAILABLE_PATHS>
            : never)
