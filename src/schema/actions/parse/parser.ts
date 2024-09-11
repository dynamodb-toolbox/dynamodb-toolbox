import type { Attribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { SchemaAction } from '~/schema/index.js'
import type { Schema } from '~/schema/index.js'
import type { Merge } from '~/types/merge.js'

import { attrParser } from './attribute.js'
import type { AttrParsedValue, AttrParserInput } from './attribute.js'
import { schemaParser } from './schema.js'
import type { SchemaParsedValue, SchemaParserInput } from './schema.js'
import type {
  FromParsingOptions,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingDefaultOptions,
  ParsingOptions
} from './types/options.js'

export type ParsedValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = SCHEMA extends Schema
  ? SchemaParsedValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrParsedValue<SCHEMA, OPTIONS>
    : never

export type ParserInput<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = SCHEMA extends Schema
  ? SchemaParserInput<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrParserInput<SCHEMA, OPTIONS>
    : never

export class Parser<SCHEMA extends Schema | Attribute> extends SchemaAction<SCHEMA> {
  constructor(schema: SCHEMA) {
    super(schema)
  }

  start<OPTIONS extends ParsingOptions = ParsingDefaultOptions>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): Generator<
    ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>>,
    ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>>
  > {
    type Parsed = ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>>

    if (this.schema.type === 'schema') {
      return schemaParser<Schema, OPTIONS>(this.schema, inputValue, options) as Generator<
        Parsed,
        Parsed
      >
    } else {
      return attrParser<Attribute, OPTIONS>(this.schema, inputValue, options) as Generator<
        Parsed,
        Parsed
      >
    }
  }

  parse<OPTIONS extends ParsingOptions = ParsingDefaultOptions>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>> {
    const parser = this.start(inputValue, options)

    let done = false
    let value: ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>>
    do {
      const nextState = parser.next()
      done = Boolean(nextState.done)
      value = nextState.value
    } while (!done)

    return value
  }

  reparse<OPTIONS extends ParsingOptions = ParsingDefaultOptions>(
    inputValue: ParserInput<SCHEMA, FromParsingOptions<OPTIONS>>,
    options: OPTIONS = {} as OPTIONS
  ): ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>> {
    return this.parse(inputValue, options)
  }

  validate<
    OPTIONS extends Pick<ParsingOptions, 'mode' | 'parseExtension'> = Pick<
      ParsingDefaultOptions,
      'mode' | 'parseExtension'
    >
  >(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): inputValue is ParsedValue<
    SCHEMA,
    FromParsingOptions<Merge<{ fill: false; transform: false }, OPTIONS>>
  > {
    try {
      this.parse(inputValue, { ...options, fill: false, transform: false })
    } catch (error) {
      if (error instanceof DynamoDBToolboxError && DynamoDBToolboxError.match(error, 'parsing.')) {
        return false
      }

      throw error
    }

    return true
  }
}
