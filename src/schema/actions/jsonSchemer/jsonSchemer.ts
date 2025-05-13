import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { getFormattedValueJSONSchema } from './formattedValue/index.js'
import type { FormattedValueJSONSchema } from './formattedValue/index.js'

export class JSONSchemer<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'jsonSchemer' as const

  formattedValueSchema(): FormattedValueJSONSchema<SCHEMA> {
    return getFormattedValueJSONSchema(this.schema)
  }
}
