import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  BinaryAttribute,
  BooleanAttribute,
  ListAttribute,
  MapAttribute,
  NullAttribute,
  NumberAttribute,
  RecordAttribute,
  ResolveAnyAttribute,
  ResolveBinaryAttribute,
  ResolveBooleanAttribute,
  ResolveNumberAttribute,
  ResolveStringAttribute,
  ResolvedNullAttribute,
  SetAttribute,
  StringAttribute
} from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { If, Optional, Overwrite } from '~/types/index.js'

import type { ReadValueOptions } from './options.js'
import type { ChildPaths, MatchKeys } from './pathUtils.js'
import type { Paths } from './paths.js'

/**
 * Returns the type of formatted values for a given Schema or Attribute (prior to hiding hidden fields)
 *
 * @param Schema Schema | Attribute
 * @return Value
 */
export type ReadValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends ReadValueOptions<SCHEMA> = {}
> = SCHEMA extends Schema
  ? SchemaReadValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrReadValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<ATTRIBUTE extends Attribute> = ATTRIBUTE extends {
  required: AtLeastOnce | Always
}
  ? true
  : false

type OptionalKeys<SCHEMA extends Schema | MapAttribute> = {
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
  ATTRIBUTE extends Attribute,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {}
> = Attribute extends ATTRIBUTE
  ? unknown
  :
      | (ATTRIBUTE extends AnyAttribute ? AnyAttrReadValue<ATTRIBUTE> : never)
      | (ATTRIBUTE extends NullAttribute
          ? If<MustBeDefined<ATTRIBUTE>, never, undefined> | ResolvedNullAttribute
          : never)
      | (ATTRIBUTE extends BooleanAttribute
          ? If<MustBeDefined<ATTRIBUTE>, never, undefined> | ResolveBooleanAttribute<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends NumberAttribute
          ? If<MustBeDefined<ATTRIBUTE>, never, undefined> | ResolveNumberAttribute<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends StringAttribute
          ? If<MustBeDefined<ATTRIBUTE>, never, undefined> | ResolveStringAttribute<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends BinaryAttribute
          ? If<MustBeDefined<ATTRIBUTE>, never, undefined> | ResolveBinaryAttribute<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends SetAttribute ? SetAttrReadValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends ListAttribute ? ListAttrReadValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends Schema | MapAttribute ? MapAttrReadValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends RecordAttribute ? RecordAttrReadValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends AnyOfAttribute ? AnyOfAttrReadValue<ATTRIBUTE, OPTIONS> : never)

type AnyAttrReadValue<ATTRIBUTE extends AnyAttribute> = AnyAttribute extends ATTRIBUTE
  ? unknown
  : ResolveAnyAttribute<ATTRIBUTE>

type SetAttrReadValue<
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {}
> = SetAttribute extends ATTRIBUTE
  ? undefined | Set<AttrReadValue<SetAttribute['elements']>>
  :
      | If<MustBeDefined<ATTRIBUTE>, never, undefined>
      | Set<AttrReadValue<ATTRIBUTE['elements'], Omit<OPTIONS, 'attributes'>>>

type ChildElementPaths<PATHS extends string> = PATHS extends `[${number}]`
  ? undefined
  : PATHS extends `[${number}]${infer CHILD_ELEMENT_PATHS}`
    ? CHILD_ELEMENT_PATHS
    : never

type ListAttrReadValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {},
  READ_ELEMENTS = ListAttribute extends ATTRIBUTE
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
> = ListAttribute extends ATTRIBUTE
  ? undefined | unknown[]
  : [READ_ELEMENTS] extends [never]
    ? never
    : If<MustBeDefined<ATTRIBUTE>, never, undefined> | READ_ELEMENTS[]

type MapAttrReadValue<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {},
  MATCHING_KEYS extends string = OPTIONS extends { attributes: string }
    ? MatchKeys<Extract<keyof ATTRIBUTE['attributes'], string>, OPTIONS['attributes']>
    : Extract<keyof ATTRIBUTE['attributes'], string>
> = MapAttribute extends ATTRIBUTE
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

type RecordAttrReadValue<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {},
  MATCHING_KEYS extends string = OPTIONS extends { attributes: string }
    ? MatchRecordKeys<ResolveStringAttribute<ATTRIBUTE['keys']>, OPTIONS['attributes']>
    : ResolveStringAttribute<ATTRIBUTE['keys']>
> = RecordAttribute extends ATTRIBUTE
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

type AnyOfAttrReadValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {}
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  : If<MustBeDefined<ATTRIBUTE>, never, undefined> | AnyOfAttrReadValueRec<ATTRIBUTE, OPTIONS>

type AnyOfAttrReadValueRec<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends ReadValueOptions<ATTRIBUTE> = {},
  ELEMENTS extends Attribute[] = ATTRIBUTE['elements'],
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? AnyOfAttrReadValueRec<
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
