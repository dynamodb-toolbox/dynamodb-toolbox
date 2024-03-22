import type { O } from 'ts-toolbelt'

import type { If } from 'v1/types/if'
import type { Schema, SchemaAction } from 'v1/schema'
import type {
  Attribute,
  ResolveAnyAttribute,
  ResolvePrimitiveAttribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Always,
  Never
} from 'v1/schema/attributes'
import type { OptionalizeUndefinableProperties } from 'v1/types/optionalizeUndefinableProperties'

import {
  Parser,
  ParsedValue,
  ParsedValueOptions,
  ParsedValueDefaultOptions,
  ParsingOptions,
  ParsingDefaultOptions,
  FromParsingOptions
} from '../parse'

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = OPTIONS extends { fill: false }
  ? ATTRIBUTE extends { required: AtLeastOnce | Always }
    ? true
    : false
  : ATTRIBUTE extends { required: AtLeastOnce | Always } & (
      | {
          key: true
          defaults: { key: undefined }
          links: { key: undefined }
        }
      | {
          key: false
          defaults: { put: undefined }
          links: { put: undefined }
        }
    )
  ? true
  : false

type SchemaParserInput<
  SCHEMA extends Schema,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = Schema extends SCHEMA
  ? { [KEY: string]: AttrParserInput<Attribute, OPTIONS> }
  : SCHEMA extends Schema
  ? OptionalizeUndefinableProperties<
      {
        [KEY in OPTIONS extends { operation: 'key' }
          ? O.SelectKeys<SCHEMA['attributes'], { key: true }>
          : keyof SCHEMA['attributes'] & string]: AttrParserInput<
          SCHEMA['attributes'][KEY],
          OPTIONS
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: Never }>
    >
  : never

type AttrParserInput<
  ATTRIBUTE extends Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = Attribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | (ATTRIBUTE extends AnyAttribute
          ? ResolveAnyAttribute<ATTRIBUTE>
          : ATTRIBUTE extends PrimitiveAttribute
          ? ResolvePrimitiveAttribute<ATTRIBUTE>
          : ATTRIBUTE extends SetAttribute
          ? Set<AttrParserInput<ATTRIBUTE['elements'], OPTIONS>>
          : ATTRIBUTE extends ListAttribute
          ? AttrParserInput<ATTRIBUTE['elements'], OPTIONS>[]
          : ATTRIBUTE extends MapAttribute
          ? OptionalizeUndefinableProperties<
              {
                [KEY in OPTIONS extends { operation: 'key' }
                  ? O.SelectKeys<ATTRIBUTE['attributes'], { key: true }>
                  : keyof ATTRIBUTE['attributes'] & string]: AttrParserInput<
                  ATTRIBUTE['attributes'][KEY],
                  OPTIONS
                >
              },
              // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
              O.SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
            >
          : ATTRIBUTE extends RecordAttribute
          ? {
              [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?: AttrParserInput<
                ATTRIBUTE['elements'],
                OPTIONS
              >
            }
          : ATTRIBUTE extends AnyOfAttribute
          ? AttrParserInput<ATTRIBUTE['elements'][number], OPTIONS>
          : never)

export type ParserInput<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = SCHEMA extends Schema
  ? SchemaParserInput<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
  ? AttrParserInput<SCHEMA, OPTIONS>
  : never

export class TParser<SCHEMA extends Schema | Attribute> implements SchemaAction<SCHEMA> {
  schema: SCHEMA
  parser: Parser<SCHEMA>

  constructor(schema: SCHEMA) {
    this.schema = schema
    this.parser = new Parser(this.schema)
  }

  start<OPTIONS extends ParsingOptions = ParsingDefaultOptions>(
    inputValue: ParserInput<SCHEMA, FromParsingOptions<OPTIONS>>,
    options: OPTIONS = {} as OPTIONS
  ): Generator<
    ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>>,
    ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>>
  > {
    return this.parser.start(inputValue, options)
  }

  parse<OPTIONS extends ParsingOptions = ParsingDefaultOptions>(
    inputValue: ParserInput<SCHEMA, FromParsingOptions<OPTIONS>>,
    options: OPTIONS = {} as OPTIONS
  ): ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>> {
    return this.parser.parse(inputValue, options)
  }
}
