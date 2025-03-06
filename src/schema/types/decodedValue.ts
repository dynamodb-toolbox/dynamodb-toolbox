import type {
  AnyOfSchema,
  AnySchema,
  BinarySchema,
  BooleanSchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  Never,
  NullSchema,
  NumberSchema,
  RecordSchema,
  ResolveAnySchema,
  ResolveBinarySchema,
  ResolveBooleanSchema,
  ResolveNumberSchema,
  ResolveStringSchema,
  ResolvedNullSchema,
  Schema,
  SetSchema,
  StringSchema
} from '~/schema/index.js'
import type { Extends, If, Not, Optional, Overwrite } from '~/types/index.js'

import type { ReadValueOptions } from './options.js'
import type { ChildPaths, MatchKeys } from './pathUtils.js'
import type { Paths } from './paths.js'

/**
 * Returns the type of formatted values for a given Schema (prior to hiding hidden fields)
 *
 * @param Schema Schema
 * @return Value
 */
export type DecodedValue<
  SCHEMA extends Schema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {}
> = SCHEMA extends ItemSchema
  ? ItemSchemaDecodedValue<SCHEMA, OPTIONS>
  : SCHEMA extends Schema
    ? SchemaDecodedValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<SCHEMA extends Schema> = Not<Extends<SCHEMA['props'], { required: Never }>>

type OptionalKeys<SCHEMA extends MapSchema | ItemSchema> = {
  [KEY in keyof SCHEMA['attributes']]: If<MustBeDefined<SCHEMA['attributes'][KEY]>, never, KEY>
}[keyof SCHEMA['attributes']]

type ItemSchemaDecodedValue<
  SCHEMA extends ItemSchema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {},
  MATCHING_KEYS extends string = OPTIONS extends { attributes: string }
    ? MatchKeys<Extract<keyof SCHEMA['attributes'], string>, OPTIONS['attributes'], ''>
    : Extract<keyof SCHEMA['attributes'], string>
> = ItemSchema extends SCHEMA
  ? { [KEY: string]: unknown }
  : // Possible in case of anyOf subSchema
    [MATCHING_KEYS] extends [never]
    ? never
    : Optional<
        {
          [KEY in MATCHING_KEYS]: SchemaDecodedValue<
            SCHEMA['attributes'][KEY],
            Overwrite<
              OPTIONS,
              {
                attributes: OPTIONS extends { attributes: string }
                  ? Extract<
                      ChildPaths<KEY, OPTIONS['attributes'], ''>,
                      Paths<SCHEMA['attributes'][KEY]> | undefined
                    >
                  : undefined
              }
            >
          >
        },
        OPTIONS extends { partial: true } ? string : OptionalKeys<SCHEMA>
      >

type SchemaDecodedValue<
  SCHEMA extends Schema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {}
> = Schema extends SCHEMA
  ? unknown
  :
      | (SCHEMA extends AnySchema ? AnySchemaDecodedValue<SCHEMA> : never)
      | (SCHEMA extends NullSchema
          ? If<MustBeDefined<SCHEMA>, never, undefined> | ResolvedNullSchema
          : never)
      | (SCHEMA extends BooleanSchema
          ? If<MustBeDefined<SCHEMA>, never, undefined> | ResolveBooleanSchema<SCHEMA>
          : never)
      | (SCHEMA extends NumberSchema
          ? If<MustBeDefined<SCHEMA>, never, undefined> | ResolveNumberSchema<SCHEMA>
          : never)
      | (SCHEMA extends StringSchema
          ? If<MustBeDefined<SCHEMA>, never, undefined> | ResolveStringSchema<SCHEMA>
          : never)
      | (SCHEMA extends BinarySchema
          ? If<MustBeDefined<SCHEMA>, never, undefined> | ResolveBinarySchema<SCHEMA>
          : never)
      | (SCHEMA extends SetSchema ? SetSchemaDecodedValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends ListSchema ? ListSchemaDecodedValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends MapSchema ? MapSchemaDecodedValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends RecordSchema ? RecordSchemaDecodedValue<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends AnyOfSchema ? AnyOfSchemaDecodedValue<SCHEMA, OPTIONS> : never)

type AnySchemaDecodedValue<SCHEMA extends AnySchema> = AnySchema extends SCHEMA
  ? unknown
  : ResolveAnySchema<SCHEMA>

type SetSchemaDecodedValue<
  SCHEMA extends SetSchema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {}
> = SetSchema extends SCHEMA
  ? undefined | Set<SchemaDecodedValue<SetSchema['elements']>>
  :
      | If<MustBeDefined<SCHEMA>, never, undefined>
      | Set<SchemaDecodedValue<SCHEMA['elements'], Omit<OPTIONS, 'attributes'>>>

type ChildElementPaths<PATHS extends string> = PATHS extends `[${number}]`
  ? undefined
  : PATHS extends `[${number}]${infer CHILD_ELEMENT_PATHS}`
    ? CHILD_ELEMENT_PATHS
    : never

type ListSchemaDecodedValue<
  SCHEMA extends ListSchema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {},
  READ_ELEMENTS = ListSchema extends SCHEMA
    ? unknown
    : SchemaDecodedValue<
        SCHEMA['elements'],
        Overwrite<
          OPTIONS,
          {
            attributes: OPTIONS extends { attributes: string }
              ? Extract<
                  ChildElementPaths<OPTIONS['attributes']>,
                  Paths<SCHEMA['elements']> | undefined
                >
              : undefined
          }
        >
      >
  // Possible in case of anyOf subSchema
> = ListSchema extends SCHEMA
  ? undefined | unknown[]
  : [READ_ELEMENTS] extends [never]
    ? never
    : If<MustBeDefined<SCHEMA>, never, undefined> | READ_ELEMENTS[]

type MapSchemaDecodedValue<
  SCHEMA extends MapSchema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {},
  MATCHING_KEYS extends string = OPTIONS extends { attributes: string }
    ? MatchKeys<Extract<keyof SCHEMA['attributes'], string>, OPTIONS['attributes']>
    : Extract<keyof SCHEMA['attributes'], string>
> = MapSchema extends SCHEMA
  ? undefined | { [KEY: string]: unknown }
  : // Possible in case of anyOf subSchema
    [MATCHING_KEYS] extends [never]
    ? never
    :
        | If<MustBeDefined<SCHEMA>, never, undefined>
        | Optional<
            {
              [KEY in MATCHING_KEYS]: SchemaDecodedValue<
                SCHEMA['attributes'][KEY],
                Overwrite<
                  OPTIONS,
                  {
                    attributes: OPTIONS extends { attributes: string }
                      ? Extract<
                          ChildPaths<KEY, OPTIONS['attributes']>,
                          Paths<SCHEMA['attributes'][KEY]> | undefined
                        >
                      : undefined
                  }
                >
              >
            },
            OPTIONS extends { partial: true } ? string : OptionalKeys<SCHEMA>
          >

// NOTE: Works for now but can probably be improved (PATHS can be used to whitelist keys when KEYS is string)
type MatchRecordKeys<KEYS extends string, PATHS extends string> = string extends KEYS
  ? string
  : MatchKeys<KEYS, PATHS>

type RecordChildPaths<
  KEYS extends string,
  PATHS extends string,
  CHILD_PATHS extends string | undefined = PATHS extends infer PATH
    ? PATH extends string
      ? PATH extends `['${KEYS}']${infer CHILD_PATHS}`
        ? CHILD_PATHS extends ''
          ? undefined
          : CHILD_PATHS
        : PATH extends `.${KEYS}${infer DELIMITER extends '.' | '['}${infer CHILD_PATHS}`
          ? `${DELIMITER}${CHILD_PATHS}`
          : PATH extends `.${KEYS}`
            ? undefined
            : never
      : never
    : never
> = undefined extends CHILD_PATHS ? undefined : CHILD_PATHS

type RecordSchemaDecodedValue<
  SCHEMA extends RecordSchema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {},
  MATCHING_KEYS extends string = OPTIONS extends { attributes: string }
    ? MatchRecordKeys<ResolveStringSchema<SCHEMA['keys']>, OPTIONS['attributes']>
    : ResolveStringSchema<SCHEMA['keys']>
> = RecordSchema extends SCHEMA
  ? undefined | Record<string, unknown>
  : // Possible in case of anyOf subSchema
    [MATCHING_KEYS] extends [never]
    ? never
    :
        | If<MustBeDefined<SCHEMA>, never, undefined>
        | Optional<
            Record<
              MATCHING_KEYS,
              SchemaDecodedValue<
                SCHEMA['elements'],
                Overwrite<
                  OPTIONS,
                  {
                    attributes: OPTIONS extends { attributes: string }
                      ? Extract<
                          RecordChildPaths<MATCHING_KEYS, OPTIONS['attributes']>,
                          Paths<SCHEMA['elements']> | undefined
                        >
                      : undefined
                  }
                >
              >
            >,
            | (SCHEMA['props'] extends { partial: true } ? string : never)
            | (OPTIONS extends { partial: true } ? string : never)
          >

type AnyOfSchemaDecodedValue<
  SCHEMA extends AnyOfSchema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {}
> = AnyOfSchema extends SCHEMA
  ? unknown
  : If<MustBeDefined<SCHEMA>, never, undefined> | MapAnyOfSchemaDecodedValue<SCHEMA, OPTIONS>

type MapAnyOfSchemaDecodedValue<
  SCHEMA extends AnyOfSchema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {},
  ELEMENTS extends Schema[] = SCHEMA['elements'],
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Schema
    ? ELEMENTS_TAIL extends Schema[]
      ? MapAnyOfSchemaDecodedValue<
          SCHEMA,
          OPTIONS,
          ELEMENTS_TAIL,
          | RESULTS
          | SchemaDecodedValue<
              ELEMENTS_HEAD,
              Overwrite<
                OPTIONS,
                {
                  attributes: OPTIONS extends { attributes: string }
                    ? Extract<OPTIONS['attributes'], Paths<ELEMENTS_HEAD> | undefined>
                    : undefined
                }
              >
            >
        >
      : never
    : never
  : [RESULTS] extends [never]
    ? unknown
    : RESULTS
