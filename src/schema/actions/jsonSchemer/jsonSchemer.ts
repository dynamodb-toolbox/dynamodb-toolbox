import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { getFormattedValueJSONSchema } from './formattedItem/index.js'
import type { FormattedValueJSONSchema } from './formattedItem/index.js'

export class JSONSchemer<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'jsonSchema' as const

  formattedValueSchema(): FormattedValueJSONSchema<SCHEMA> {
    return getFormattedValueJSONSchema(this.schema)
  }
}
