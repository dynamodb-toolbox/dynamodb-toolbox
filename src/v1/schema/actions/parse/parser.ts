import type { Schema, Attribute, SchemaAction } from 'v1/schema'

import type {
  ParsedValueOptions,
  ParsedValueDefaultOptions,
  ParsingOptions,
  ParsingDefaultOptions,
  FromParsingOptions
} from './types'

import { schemaWorkflow, SchemaParsedValue } from './schema'
import { attrWorkflow, AttrParsedValue } from './attribute'

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

  workflow<OPTIONS extends ParsingOptions = ParsingDefaultOptions>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): Generator<
    ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>>,
    ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>>
  > {
    type Parsed = ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>>

    if (this.schema.type === 'schema') {
      return schemaWorkflow<Schema, OPTIONS>(this.schema, inputValue, options) as Generator<
        Parsed,
        Parsed
      >
    } else {
      return attrWorkflow<Attribute, OPTIONS>(this.schema, inputValue, options) as Generator<
        Parsed,
        Parsed
      >
    }
  }

  parse<OPTIONS extends ParsingOptions = ParsingDefaultOptions>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>> {
    const workflow = this.workflow(inputValue, options)

    let done = false
    let value: ParsedValue<SCHEMA, FromParsingOptions<OPTIONS>>
    do {
      const nextState = workflow.next()
      done = Boolean(nextState.done)
      value = nextState.value
    } while (!done)

    return value
  }
}
