import type { Attribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type {
  FormattedValue,
  ReadValue,
  ReadValueOptions,
  Schema,
  TransformedValue
} from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { attrFormatter } from './attribute.js'
import type { FormatValueOptions, InferReadValueOptions } from './options.js'
import { schemaFormatter } from './schema.js'

export type FormatterYield<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormatValueOptions<SCHEMA> = {},
  READ_VALUE_OPTIONS extends ReadValueOptions<SCHEMA> = InferReadValueOptions<SCHEMA, OPTIONS>
> = OPTIONS extends { transform: false } | { format: false }
  ? never
  : ReadValue<SCHEMA, READ_VALUE_OPTIONS>

export type FormatterReturn<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormatValueOptions<SCHEMA> = {},
  READ_VALUE_OPTIONS extends ReadValueOptions<SCHEMA> = InferReadValueOptions<SCHEMA, OPTIONS>
> = OPTIONS extends { format: false }
  ? ReadValue<SCHEMA, READ_VALUE_OPTIONS>
  : FormattedValue<SCHEMA, READ_VALUE_OPTIONS>

export class Formatter<
  SCHEMA extends Schema | Attribute = Schema | Attribute
> extends SchemaAction<SCHEMA> {
  start<OPTIONS extends FormatValueOptions<SCHEMA> = {}>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): Generator<FormatterYield<SCHEMA, OPTIONS>, FormatterReturn<SCHEMA, OPTIONS>> {
    if (this.schema.type === 'schema') {
      return schemaFormatter(this.schema, inputValue, options) as Generator<
        FormatterYield<SCHEMA, OPTIONS>,
        FormatterReturn<SCHEMA, OPTIONS>
      >
    } else {
      return attrFormatter(this.schema, inputValue, options) as Generator<
        FormatterYield<SCHEMA, OPTIONS>,
        FormatterReturn<SCHEMA, OPTIONS>
      >
    }
  }

  format<OPTIONS extends FormatValueOptions<SCHEMA> = {}>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): FormatterReturn<SCHEMA, OPTIONS> {
    const formatter = this.start(inputValue, options)

    let done = false
    let value: FormatterReturn<SCHEMA, OPTIONS>
    do {
      const nextState = formatter.next()
      done = Boolean(nextState.done)
      // TODO: Not cast
      value = nextState.value as FormatterReturn<SCHEMA, OPTIONS>
    } while (!done)

    return value
  }

  validate(inputValue: unknown): inputValue is TransformedValue<SCHEMA> {
    try {
      this.format(inputValue, { format: false })
    } catch (error) {
      if (
        error instanceof DynamoDBToolboxError &&
        DynamoDBToolboxError.match(error, 'formatter.')
      ) {
        return false
      }

      throw error
    }

    return true
  }
}
