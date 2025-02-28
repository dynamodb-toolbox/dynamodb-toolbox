import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'
import type { InputValue, TransformedValue, ValidValue, WriteValueOptions } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { attrParser } from './attribute.js'
import type { InferWriteValueOptions, ParseValueOptions } from './options.js'
import { schemaParser } from './schema.js'

type ParserInput<
  SCHEMA extends Schema,
  OPTIONS extends ParseValueOptions = {},
  WRITE_VALUE_OPTIONS extends WriteValueOptions = InferWriteValueOptions<OPTIONS>
> = OPTIONS extends { fill: false }
  ? ValidValue<SCHEMA, WRITE_VALUE_OPTIONS>
  : InputValue<SCHEMA, WRITE_VALUE_OPTIONS>

export type ParserYield<
  SCHEMA extends Schema,
  OPTIONS extends ParseValueOptions = {},
  WRITE_VALUE_OPTIONS extends WriteValueOptions = InferWriteValueOptions<OPTIONS>
> =
  | (OPTIONS extends { fill: false } ? never : InputValue<SCHEMA, WRITE_VALUE_OPTIONS>)
  | ValidValue<SCHEMA, WRITE_VALUE_OPTIONS>

export type ParserReturn<
  SCHEMA extends Schema,
  OPTIONS extends ParseValueOptions = {},
  WRITE_VALUE_OPTIONS extends WriteValueOptions = InferWriteValueOptions<OPTIONS>
> = OPTIONS extends { transform: false }
  ? ValidValue<SCHEMA, WRITE_VALUE_OPTIONS>
  : TransformedValue<SCHEMA, WRITE_VALUE_OPTIONS>

export class Parser<SCHEMA extends Schema> extends SchemaAction<SCHEMA> {
  start<OPTIONS extends ParseValueOptions = {}>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): Generator<ParserYield<SCHEMA, OPTIONS>, ParserReturn<SCHEMA, OPTIONS>> {
    if (this.schema.type === 'item') {
      return schemaParser(this.schema, inputValue, options) as Generator<
        ParserYield<SCHEMA, OPTIONS>,
        ParserReturn<SCHEMA, OPTIONS>
      >
    } else {
      return attrParser(this.schema, inputValue, options) as Generator<
        ParserYield<SCHEMA, OPTIONS>,
        ParserReturn<SCHEMA, OPTIONS>
      >
    }
  }

  parse<OPTIONS extends ParseValueOptions = {}>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): ParserReturn<SCHEMA, OPTIONS> {
    const parser = this.start(inputValue, options)

    let done = false
    let value: ParserReturn<SCHEMA, OPTIONS>
    do {
      const nextProps = parser.next()
      done = Boolean(nextProps.done)
      // TODO: Not cast
      value = nextProps.value as ParserReturn<SCHEMA, OPTIONS>
    } while (!done)

    return value
  }

  reparse<OPTIONS extends ParseValueOptions = {}>(
    inputValue: ParserInput<SCHEMA, OPTIONS>,
    options: OPTIONS = {} as OPTIONS
  ): ParserReturn<SCHEMA, OPTIONS> {
    return this.parse(inputValue, options)
  }

  validate<OPTIONS extends Omit<ParseValueOptions, 'fill' | 'transform'> = {}>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): inputValue is ValidValue<SCHEMA, OPTIONS> {
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
