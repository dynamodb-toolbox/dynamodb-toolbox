import type { Attribute } from '~/attributes/index.js'
import { SchemaAction } from '~/schema/index.js'
import type { FormattedValue, ReadValue, ReadValueOptions, Schema } from '~/schema/index.js'

import { attrFormatter } from './attribute.js'
import type { FormatValueOptions, InferReadValueOptions } from './options.js'
import { schemaFormatter } from './schema.js'

export type FormatterYield<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormatValueOptions<SCHEMA> = {},
  READ_VALUE_OPTIONS extends ReadValueOptions<SCHEMA> = InferReadValueOptions<SCHEMA, OPTIONS>
> = OPTIONS extends { transform: false }
  ? FormattedValue<SCHEMA, READ_VALUE_OPTIONS>
  : ReadValue<SCHEMA, READ_VALUE_OPTIONS> | FormattedValue<SCHEMA, READ_VALUE_OPTIONS>

export type FormatterReturn<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormatValueOptions<SCHEMA> = {}
> = FormattedValue<SCHEMA, InferReadValueOptions<SCHEMA, OPTIONS>>

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
}
