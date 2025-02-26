import type {
  AnyOfSchema,
  AnySchema,
  AttrSchema,
  BinarySchema,
  BooleanSchema,
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
  SetSchema,
  StringSchema
} from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { Extends, If, Not, Optional, Overwrite } from '~/types/index.js'

import type { ReadValueOptions } from './options.js'
import type { ChildPaths, MatchKeys } from './pathUtils.js'
import type { Paths } from './paths.js'

/**
 * Returns the type of formatted values for a given Schema or AttrSchema (prior to hiding hidden fields)
 *
 * @param Schema Schema | AttrSchema
 * @return Value
 */
export type ReadValue<
  SCHEMA extends Schema | AttrSchema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {}
> = SCHEMA extends Schema
  ? SchemaReadValue<SCHEMA, OPTIONS>
  : SCHEMA extends AttrSchema
    ? AttrReadValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<ATTRIBUTE extends AttrSchema> = Not<
  Extends<ATTRIBUTE['state'], { required: Never }>
>

type OptionalKeys<SCHEMA extends Schema | MapSchema> = {
  [KEY in keyof SCHEMA['attributes']]: If<MustBeDefined<SCHEMA['attributes'][KEY]>, never, KEY>
}[keyof SCHEMA['attributes']]

type SchemaReadValue<
  SCHEMA extends Schema,
  OPTIONS extends ReadValueOptions<SCHEMA> = {},
  MATCHING_KEYS extends string = OPTIONS extends { attributes: string }
    ? MatchKeys<Extract<keyof SCHEMA['attributes'], string>, OPTIONS['attributes'], ''>
    : Extract<keyof SCHEMA['attributes'], string>
> = Schema extends SCHEMA
  ? { [KEY: string]: unknown }
  : // Possible in case of anyOf subSchema
    [MATCHING_KEYS] extends [never]
    ? never
    : Optional<
        {
          [KEY in MATCHING_KEYS]: AttrReadValue<
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

type AttrReadValue<
  ATTRIBUTE extends AttrSchema,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {}
> = AttrSchema extends ATTRIBUTE
  ? unknown
  :
      | (ATTRIBUTE extends AnySchema ? AnySchemaReadValue<ATTRIBUTE> : never)
      | (ATTRIBUTE extends NullSchema
          ? If<MustBeDefined<ATTRIBUTE>, never, undefined> | ResolvedNullSchema
          : never)
      | (ATTRIBUTE extends BooleanSchema
          ? If<MustBeDefined<ATTRIBUTE>, never, undefined> | ResolveBooleanSchema<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends NumberSchema
          ? If<MustBeDefined<ATTRIBUTE>, never, undefined> | ResolveNumberSchema<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends StringSchema
          ? If<MustBeDefined<ATTRIBUTE>, never, undefined> | ResolveStringSchema<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends BinarySchema
          ? If<MustBeDefined<ATTRIBUTE>, never, undefined> | ResolveBinarySchema<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends SetSchema ? SetSchemaReadValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends ListSchema ? ListSchemaReadValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends Schema | MapSchema ? MapSchemaReadValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends RecordSchema ? RecordSchemaReadValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends AnyOfSchema ? AnyOfSchemaReadValue<ATTRIBUTE, OPTIONS> : never)

type AnySchemaReadValue<ATTRIBUTE extends AnySchema> = AnySchema extends ATTRIBUTE
  ? unknown
  : ResolveAnySchema<ATTRIBUTE>

type SetSchemaReadValue<
  ATTRIBUTE extends SetSchema,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {}
> = SetSchema extends ATTRIBUTE
  ? undefined | Set<AttrReadValue<SetSchema['elements']>>
  :
      | If<MustBeDefined<ATTRIBUTE>, never, undefined>
      | Set<AttrReadValue<ATTRIBUTE['elements'], Omit<OPTIONS, 'attributes'>>>

type ChildElementPaths<PATHS extends string> = PATHS extends `[${number}]`
  ? undefined
  : PATHS extends `[${number}]${infer CHILD_ELEMENT_PATHS}`
    ? CHILD_ELEMENT_PATHS
    : never

type ListSchemaReadValue<
  ATTRIBUTE extends ListSchema,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {},
  READ_ELEMENTS = ListSchema extends ATTRIBUTE
    ? unknown
    : AttrReadValue<
        ATTRIBUTE['elements'],
        Overwrite<
          OPTIONS,
          {
            attributes: OPTIONS extends { attributes: string }
              ? Extract<
                  ChildElementPaths<OPTIONS['attributes']>,
                  Paths<ATTRIBUTE['elements']> | undefined
                >
              : undefined
          }
        >
      >
  // Possible in case of anyOf subSchema
> = ListSchema extends ATTRIBUTE
  ? undefined | unknown[]
  : [READ_ELEMENTS] extends [never]
    ? never
    : If<MustBeDefined<ATTRIBUTE>, never, undefined> | READ_ELEMENTS[]

type MapSchemaReadValue<
  ATTRIBUTE extends MapSchema,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {},
  MATCHING_KEYS extends string = OPTIONS extends { attributes: string }
    ? MatchKeys<Extract<keyof ATTRIBUTE['attributes'], string>, OPTIONS['attributes']>
    : Extract<keyof ATTRIBUTE['attributes'], string>
> = MapSchema extends ATTRIBUTE
  ? undefined | { [KEY: string]: unknown }
  : // Possible in case of anyOf subSchema
    [MATCHING_KEYS] extends [never]
    ? never
    :
        | If<MustBeDefined<ATTRIBUTE>, never, undefined>
        | Optional<
            {
              [KEY in MATCHING_KEYS]: AttrReadValue<
                ATTRIBUTE['attributes'][KEY],
                Overwrite<
                  OPTIONS,
                  {
                    attributes: OPTIONS extends { attributes: string }
                      ? Extract<
                          ChildPaths<KEY, OPTIONS['attributes']>,
                          Paths<ATTRIBUTE['attributes'][KEY]> | undefined
                        >
                      : undefined
                  }
                >
              >
            },
            OPTIONS extends { partial: true } ? string : OptionalKeys<ATTRIBUTE>
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

type RecordSchemaReadValue<
  ATTRIBUTE extends RecordSchema,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {},
  MATCHING_KEYS extends string = OPTIONS extends { attributes: string }
    ? MatchRecordKeys<ResolveStringSchema<ATTRIBUTE['keys']>, OPTIONS['attributes']>
    : ResolveStringSchema<ATTRIBUTE['keys']>
> = RecordSchema extends ATTRIBUTE
  ? undefined | { [KEY: string]: unknown }
  : // Possible in case of anyOf subSchema
    [MATCHING_KEYS] extends [never]
    ? never
    :
        | If<MustBeDefined<ATTRIBUTE>, never, undefined>
        | {
            [KEY in MATCHING_KEYS]?: AttrReadValue<
              ATTRIBUTE['elements'],
              Overwrite<
                OPTIONS,
                {
                  attributes: OPTIONS extends { attributes: string }
                    ? Extract<
                        RecordChildPaths<MATCHING_KEYS, OPTIONS['attributes']>,
                        Paths<ATTRIBUTE['elements']> | undefined
                      >
                    : undefined
                }
              >
            >
          }

type AnyOfSchemaReadValue<
  ATTRIBUTE extends AnyOfSchema,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {}
> = AnyOfSchema extends ATTRIBUTE
  ? unknown
  : If<MustBeDefined<ATTRIBUTE>, never, undefined> | MapAnyOfSchemaReadValue<ATTRIBUTE, OPTIONS>

type MapAnyOfSchemaReadValue<
  ATTRIBUTE extends AnyOfSchema,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {},
  ELEMENTS extends AttrSchema[] = ATTRIBUTE['elements'],
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends AttrSchema
    ? ELEMENTS_TAIL extends AttrSchema[]
      ? MapAnyOfSchemaReadValue<
          ATTRIBUTE,
          OPTIONS,
          ELEMENTS_TAIL,
          | RESULTS
          | AttrReadValue<
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
