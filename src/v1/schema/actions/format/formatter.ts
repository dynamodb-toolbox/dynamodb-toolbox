import type { Schema, Attribute, SchemaAction, Paths } from 'v1/schema'

import type { FormatOptions, FormattedValueOptions, UnpackFormatOptions } from './types'
import { formatAttrRawValue, AttrFormattedValue } from './attribute'
import { formatSchemaRawValue, SchemaFormattedValue } from './schema'

/**
 * Returns the type of formatted values for a given Schema or Attribute
 *
 * @param Schema Schema | Attribute
 * @return Value
 */
export type FormattedValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormattedValueOptions<Paths<SCHEMA>> = FormattedValueOptions<Paths<SCHEMA>>
> = SCHEMA extends Schema
  ? SchemaFormattedValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
  ? AttrFormattedValue<SCHEMA, OPTIONS>
  : never

export class Formatter<SCHEMA extends Schema | Attribute = Schema | Attribute>
  implements SchemaAction<SCHEMA> {
  schema: SCHEMA

  constructor(schema: SCHEMA) {
    this.schema = schema
  }

  format<OPTIONS extends FormatOptions<Paths<SCHEMA>>>(
    rawValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): FormattedValue<SCHEMA, UnpackFormatOptions<OPTIONS>> {
    type Formatted = FormattedValue<SCHEMA, UnpackFormatOptions<OPTIONS>>

    if (this.schema.type === 'schema') {
      return formatSchemaRawValue<Schema>(this.schema, rawValue, options) as Formatted
    } else {
      return formatAttrRawValue<Attribute>(this.schema, rawValue, options) as Formatted
    }
  }
}
