import type { Attribute } from '~/attributes/index.js'
import { SchemaAction } from '~/schema/index.js'
import type { Schema } from '~/schema/index.js'

import { formatAttrRawValue } from './attribute.js'
import type { AttrFormattedValue } from './attribute.js'
import { formatSchemaRawValue } from './schema.js'
import type { SchemaFormattedValue } from './schema.js'
import type {
  FormatOptions,
  FormattedValueDefaultOptions,
  FormattedValueOptions,
  FromFormatOptions
} from './types.js'

/**
 * Returns the type of formatted values for a given Schema or Attribute
 *
 * @param Schema Schema | Attribute
 * @return Value
 */
export type FormattedValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormattedValueOptions<SCHEMA> = FormattedValueDefaultOptions
> = SCHEMA extends Schema
  ? SchemaFormattedValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrFormattedValue<SCHEMA, OPTIONS>
    : never

export class Formatter<
  SCHEMA extends Schema | Attribute = Schema | Attribute
> extends SchemaAction<SCHEMA> {
  constructor(schema: SCHEMA) {
    super(schema)
  }

  format<OPTIONS extends FormatOptions<SCHEMA>>(
    rawValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): FormattedValue<SCHEMA, FromFormatOptions<SCHEMA, OPTIONS>> {
    type Formatted = FormattedValue<SCHEMA, FromFormatOptions<SCHEMA, OPTIONS>>

    if (this.schema.type === 'schema') {
      return formatSchemaRawValue(this.schema, rawValue, options) as Formatted
    } else {
      return formatAttrRawValue(this.schema, rawValue, options) as Formatted
    }
  }
}
