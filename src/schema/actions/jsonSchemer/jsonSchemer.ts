import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { getFormattedValueJSONSchema } from './formattedValue/index.js'
import type { FormattedValueJSONSchema } from './formattedValue/index.js'

/**
 * Convert a schema to the JSON Schema of its formatted value.
 */
export class JSONSchemer<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'jsonSchemer' as const

  /**
   * Build the JSON Schema of the schema's formatted value.
   */
  formattedValueSchema(): FormattedValueJSONSchema<SCHEMA> {
    return getFormattedValueJSONSchema(this.schema)
  }
}
