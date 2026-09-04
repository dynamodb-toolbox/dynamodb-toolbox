import { DynamoDBToolboxError } from '~/errors/index.js'
import type {
  DecodedValue,
  FormattedValue,
  ReadValueOptions,
  Schema,
  TransformedValue
} from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { itemFormatter } from './item.js'
import type { FormatValueOptions, InferReadValueOptions } from './options.js'
import { schemaFormatter } from './schema.js'

/**
 * Values yielded by the formatter at each pipeline step.
 */
export type FormatterYield<
  SCHEMA extends Schema,
  OPTIONS extends FormatValueOptions<SCHEMA> = {},
  READ_VALUE_OPTIONS extends ReadValueOptions<SCHEMA> = InferReadValueOptions<SCHEMA, OPTIONS>
> = OPTIONS extends { transform: false } | { format: false }
  ? never
  : DecodedValue<SCHEMA, READ_VALUE_OPTIONS>

/**
 * Final value returned by the formatter.
 */
export type FormatterReturn<
  SCHEMA extends Schema,
  OPTIONS extends FormatValueOptions<SCHEMA> = {},
  READ_VALUE_OPTIONS extends ReadValueOptions<SCHEMA> = InferReadValueOptions<SCHEMA, OPTIONS>
> = OPTIONS extends { format: false }
  ? DecodedValue<SCHEMA, READ_VALUE_OPTIONS>
  : FormattedValue<SCHEMA, READ_VALUE_OPTIONS>

/**
 * Decodes and formats a saved value back to its app-facing shape.
 */
export class Formatter<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'format' as const

  /**
   * Run the format pipeline lazily, yielding each intermediate step.
   */
  start<OPTIONS extends FormatValueOptions<SCHEMA> = {}>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): Generator<FormatterYield<SCHEMA, OPTIONS>, FormatterReturn<SCHEMA, OPTIONS>> {
    if (this.schema.type === 'item') {
      return itemFormatter(this.schema, inputValue, options) as Generator<
        FormatterYield<SCHEMA, OPTIONS>,
        FormatterReturn<SCHEMA, OPTIONS>
      >
    } else {
      return schemaFormatter(this.schema, inputValue, options) as Generator<
        FormatterYield<SCHEMA, OPTIONS>,
        FormatterReturn<SCHEMA, OPTIONS>
      >
    }
  }

  /**
   * Format a saved value into its app-facing shape.
   */
  format<OPTIONS extends FormatValueOptions<SCHEMA> = {}>(
    inputValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): FormatterReturn<SCHEMA, OPTIONS> {
    const formatter = this.start(inputValue, options)

    let done = false
    let value: FormatterReturn<SCHEMA, OPTIONS>
    do {
      const nextProps = formatter.next()
      done = Boolean(nextProps.done)
      // TODO: Not cast
      value = nextProps.value as FormatterReturn<SCHEMA, OPTIONS>
    } while (!done)

    return value
  }

  /**
   * Whether a value matches the schema's transformed (saved) form.
   */
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
