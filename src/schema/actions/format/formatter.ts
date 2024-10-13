import type { Attribute } from '~/attributes/index.js'
import { SchemaAction } from '~/schema/index.js'
import type { FormattedValue, Schema } from '~/schema/index.js'

import { formatAttrRawValue } from './attribute.js'
import type { FormatValueOptions, InferValueOptions } from './options.js'
import { formatSchemaRawValue } from './schema.js'

export class Formatter<
  SCHEMA extends Schema | Attribute = Schema | Attribute
> extends SchemaAction<SCHEMA> {
  format<OPTIONS extends FormatValueOptions<SCHEMA> = {}>(
    rawValue: unknown,
    options: OPTIONS = {} as OPTIONS
  ): FormattedValue<SCHEMA, InferValueOptions<SCHEMA, OPTIONS>> {
    type Formatted = FormattedValue<SCHEMA, InferValueOptions<SCHEMA, OPTIONS>>

    if (this.schema.type === 'schema') {
      return formatSchemaRawValue(this.schema, rawValue, options) as Formatted
    } else {
      return formatAttrRawValue(this.schema, rawValue, options) as Formatted
    }
  }
}
