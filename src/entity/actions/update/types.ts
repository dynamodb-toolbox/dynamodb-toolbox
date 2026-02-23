import type { Entity } from '~/entity/index.js'
import type {
  Always,
  AnyOfSchema,
  AnySchema,
  ItemSchema,
  ItemUnextendedValue,
  ListExtendedValue,
  ListSchema,
  MapExtendedValue,
  MapSchema,
  Never,
  NumberExtendedValue,
  NumberSchema,
  Paths,
  PrimitiveSchema,
  RecordExtendedValue,
  RecordSchema,
  ResolveAnySchema,
  ResolvePrimitiveSchema,
  ResolveStringSchema,
  Schema,
  SchemaExtendedValue,
  SetExtendedValue,
  SetSchema,
  TupleExtendedValue,
  TupleSchema,
  ValidValue,
  ValidValueRec
} from '~/schema/index.js'
import type { Extends, If, Not, Optional, Overwrite } from '~/types/index.js'

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
  DELETE,
  Extended,
  GET,
  PREPEND,
  REMOVE,
  SET,
  SUBTRACT,
  SUM,
  Unextended
} from './symbols/index.js'

export type ReferenceExtension = {
  type: '*'
  value: Extended<{ [$GET]: [ref: string, fallback?: SchemaExtendedValue<ReferenceExtension>] }>
}

export type UpdateItemInputExtension =
  | ReferenceExtension
  | { type: '*'; value: Extended<{ [$REMOVE]: true }> }
  | {
      type: 'number'
      value:
        | Extended<{ [$ADD]: number }>
        | Extended<{
            [$SUM]: [
              NumberExtendedValue<ReferenceExtension>,
              NumberExtendedValue<ReferenceExtension>
            ]
          }>
        | Extended<{
            [$SUBTRACT]: [
              NumberExtendedValue<ReferenceExtension>,
              NumberExtendedValue<ReferenceExtension>
            ]
          }>
    }
  | {
      type: 'set'
      value: Extended<{ [$ADD]: SetExtendedValue } | { [$DELETE]: SetExtendedValue }>
    }
  | {
      type: 'list'
      value:
        | Unextended<{
            [INDEX in number]: SchemaExtendedValue<UpdateItemInputExtension> | undefined
          }>
        | Extended<{ [$SET]: ListExtendedValue }>
        | Extended<
            | { [$APPEND]: SchemaExtendedValue<ReferenceExtension> | SchemaExtendedValue[] }
            | { [$PREPEND]: SchemaExtendedValue<ReferenceExtension> | SchemaExtendedValue[] }
            /**
             * @debt feature "CONCAT to join two unrelated lists"
             */
          >
    }
  | {
      type: 'tuple'
      value:
        | Unextended<{
            [INDEX in number]: SchemaExtendedValue<UpdateItemInputExtension> | undefined
          }>
        | Extended<{ [$SET]: TupleExtendedValue }>
    }
  | {
      type: 'map'
      value: Extended<{ [$SET]: MapExtendedValue }>
    }
  | {
      type: 'record'
      value: Extended<{ [$SET]: RecordExtendedValue }>
    }

/**
 * User input of an UPDATE command for a given Entity or Schema
 *
 * @param Schema Entity | Schema
 * @param RequireDefaults Boolean
 * @return Object
 */
export type UpdateItemInput<
  SCHEMA extends Entity = Entity,
  OPTIONS extends UpdateInputOptions = {}
> = Entity extends SCHEMA
  ? ItemUnextendedValue<UpdateItemInputExtension>
  : UpdateValueInput<SCHEMA['schema'], OPTIONS>

interface UpdateInputOptions {
  filled?: boolean
  defined?: boolean
  extended?: boolean
}

type MustBeDefined<SCHEMA extends Schema, OPTIONS extends UpdateInputOptions = {}> = If<
  Extends<OPTIONS, { defined: true }>,
  true,
  If<
    Extends<OPTIONS, { filled: true }>,
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
>

type IsExtended<OPTIONS extends UpdateInputOptions = {}> = Not<
  Extends<OPTIONS, { extended: false }>
>

type OptionalKeys<
  SCHEMA extends ItemSchema | MapSchema,
  OPTIONS extends UpdateInputOptions = {}
> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeDefined<SCHEMA['attributes'][KEY], OPTIONS>,
    never,
    KEY
  >
}[keyof SCHEMA['attributes']]

type CanBeRemoved<SCHEMA extends Schema> = Extends<SCHEMA['props'], { required: Never }>

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
export type UpdateValueInput<
  SCHEMA extends Schema = Schema,
  OPTIONS extends UpdateInputOptions = {},
  AVAILABLE_PATHS extends string = string
> = Schema extends SCHEMA
  ? SchemaExtendedValue<UpdateItemInputExtension> | undefined
  : SCHEMA extends ItemSchema
    ? Optional<
        {
          [KEY in keyof SCHEMA['attributes']]: UpdateValueInput<
            SCHEMA['attributes'][KEY],
            Overwrite<OPTIONS, { defined: false; extended: true }>,
            Paths<SCHEMA>
          >
        },
        OptionalKeys<SCHEMA, Overwrite<OPTIONS, { defined: false }>>
      >
    :
        | If<MustBeDefined<SCHEMA, OPTIONS>, never, undefined>
        | If<
            IsExtended<OPTIONS>,
            | If<CanBeRemoved<SCHEMA>, REMOVE, never>
            // Not using Reference<...> for improved type display
            | GET<
                [
                  ref: AVAILABLE_PATHS,
                  fallback?:
                    | ValidValue<SCHEMA, { defined: true }>
                    | Reference<SCHEMA, AVAILABLE_PATHS>
                ]
              >
          >
        | (SCHEMA extends AnySchema ? ResolveAnySchema<SCHEMA> | unknown : never)
        | (SCHEMA extends PrimitiveSchema ? ResolvePrimitiveSchema<SCHEMA> : never)
        | (SCHEMA extends NumberSchema
            ? If<
                IsExtended<OPTIONS>,
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
              >
            : never)
        | (SCHEMA extends SetSchema
            ?
                | Unextended<Set<ValidValue<SCHEMA['elements']>>>
                | If<
                    IsExtended<OPTIONS>,
                    | ADD<Set<ValidValue<SCHEMA['elements']>>>
                    | DELETE<Set<ValidValue<SCHEMA['elements']>>>
                  >
            : never)
        | (SCHEMA extends ListSchema
            ?
                | Unextended<{
                    [INDEX in number]?:
                      | UpdateValueInput<
                          SCHEMA['elements'],
                          Overwrite<OPTIONS, { defined: false; extended: true }>,
                          AVAILABLE_PATHS
                        >
                      | REMOVE
                  }>
                | If<
                    IsExtended<OPTIONS>,
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
                  >
            : never)
        | (SCHEMA extends TupleSchema
            ?
                | Unextended<
                    UpdateValueInputRec<
                      SCHEMA['elements'],
                      Overwrite<OPTIONS, { defined: false; extended: true }>,
                      AVAILABLE_PATHS
                    >
                  >
                | Unextended<{
                    [ELEMENT_ENTRY in UpdateValueInputRecEntries<
                      SCHEMA['elements'],
                      Overwrite<OPTIONS, { defined: false; extended: true }>,
                      AVAILABLE_PATHS
                    > as ELEMENT_ENTRY[0]]?: ELEMENT_ENTRY[1]
                  }>
                | If<IsExtended<OPTIONS>, SET<ValidValueRec<SCHEMA['elements'], { defined: true }>>>
            : never)
        | (SCHEMA extends MapSchema
            ?
                | Unextended<
                    Optional<
                      {
                        [KEY in keyof SCHEMA['attributes']]: UpdateValueInput<
                          SCHEMA['attributes'][KEY],
                          Overwrite<OPTIONS, { defined: false; extended: true }>,
                          AVAILABLE_PATHS
                        >
                      },
                      OptionalKeys<SCHEMA, Overwrite<OPTIONS, { defined: false }>>
                    >
                  >
                | If<IsExtended<OPTIONS>, SET<ValidValue<SCHEMA, { defined: true }>>>
            : never)
        | (SCHEMA extends RecordSchema
            ?
                | Unextended<{
                    [KEY in ResolveStringSchema<SCHEMA['keys']>]?:
                      | UpdateValueInput<
                          SCHEMA['elements'],
                          Overwrite<OPTIONS, { defined: false; extended: true }>,
                          AVAILABLE_PATHS
                        >
                      | REMOVE
                  }>
                | If<IsExtended<OPTIONS>, SET<ValidValue<SCHEMA, { defined: true }>>>
            : never)
        | (SCHEMA extends AnyOfSchema
            ? UpdateValueInput<SCHEMA['elements'][number], OPTIONS, AVAILABLE_PATHS>
            : never)

export type UpdateValueInputRec<
  SCHEMAS extends Schema[] = Schema[],
  OPTIONS extends UpdateInputOptions = {},
  AVAILABLE_PATHS extends string = string,
  RESULTS extends unknown[] = []
> = SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
  ? SCHEMAS_HEAD extends Schema
    ? SCHEMAS_TAIL extends Schema[]
      ? UpdateValueInputRec<
          SCHEMAS_TAIL,
          OPTIONS,
          AVAILABLE_PATHS,
          [...RESULTS, UpdateValueInput<SCHEMAS_HEAD, OPTIONS, AVAILABLE_PATHS>]
        >
      : never
    : never
  : RESULTS

export type UpdateValueInputRecEntries<
  SCHEMAS extends Schema[] = Schema[],
  OPTIONS extends UpdateInputOptions = {},
  AVAILABLE_PATHS extends string = string,
  ENTRIES extends [number, unknown] = never
> = SCHEMAS extends [...infer SCHEMAS_INIT, infer SCHEMAS_LAST]
  ? SCHEMAS_LAST extends Schema
    ? SCHEMAS_INIT extends Schema[]
      ? UpdateValueInputRecEntries<
          SCHEMAS_INIT,
          OPTIONS,
          AVAILABLE_PATHS,
          | ENTRIES
          | [SCHEMAS_INIT['length'], UpdateValueInput<SCHEMAS_LAST, OPTIONS, AVAILABLE_PATHS>]
        >
      : never
    : never
  : ENTRIES
