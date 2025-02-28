import type { AttrSchema } from '~/attributes/index.js'
import { SchemaAction } from '~/schema/index.js'

import { getFormattedValueJSONSchema } from './formattedItem/index.js'
import type { FormattedValueJSONSchema } from './formattedItem/index.js'

export class JSONSchemer<SCHEMA extends AttrSchema = AttrSchema> extends SchemaAction<SCHEMA> {
  static actionName = 'jsonSchemer' as const

  formattedValueSchema(): FormattedValueJSONSchema<SCHEMA> {
    return getFormattedValueJSONSchema(this.schema)
  }
}
