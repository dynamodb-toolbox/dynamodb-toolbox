import type { Attribute } from '~/schema/attributes/index.js'
import type { Schema, SchemaAction } from '~/schema/index.js'

import { attrParser } from './attribute.js'
import type { AttrParsedValue } from './attribute.js'
import { schemaParser } from './schema.js'
import type { SchemaParsedValue } from './schema.js'
import type {
  FromParsingOptions,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingDefaultOptions,
  ParsingOptions
} from './types/options.js'
import type { ParserInput } from './types/parserInput.js'

export type ParsedValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = SCHEMA extends Schema
  ? SchemaParsedValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrParsedValue<SCHEMA, OPTIONS>
    : never

export class Parser<SCHEMA extends Schema | Attribute> implements SchemaAction<SCHEMA> {
  schema: SCHEMA

  constructor(schema: SCHEMA) {
    this.schema = schema
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
}
