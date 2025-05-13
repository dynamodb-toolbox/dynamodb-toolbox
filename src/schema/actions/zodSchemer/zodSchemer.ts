import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { getFormattedValueZodSchema } from './formattedValue/index.js'
import type { FormattedValueZodSchema } from './formattedValue/index.js'

export class ZodSchemer<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'zodSchemer' as const

  formattedValueSchema(): FormattedValueZodSchema<SCHEMA> {
    return getFormattedValueZodSchema(this.schema)
  }
}
