import { SchemaAction } from '~/schema/index.js'
import type { Schema } from '~/schema/index.js'

import { getFormattedItemJSONSchema } from './formattedItem/index.js'
import type { FormattedItemJSONSchema } from './formattedItem/index.js'

export class JSONSchemer<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static actionName = 'jsonSchemer' as const

  formattedItemSchema(): FormattedItemJSONSchema<SCHEMA> {
    return getFormattedItemJSONSchema(this.schema)
  }
}
