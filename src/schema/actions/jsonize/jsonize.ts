import { SchemaAction } from '~/schema/index.js'
import type { Schema } from '~/schema/index.js'

import { jsonizeAttribute } from './jsonizeAttribute/index.js'
import type { JSONizedSchema } from './schema/index.js'

export class JSONizer<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static actionName = 'jsonize' as const

  jsonize(): JSONizedSchema {
    return {
      type: 'schema',
      attributes: Object.fromEntries(
        Object.entries(this.schema.attributes).map(([attributeName, attribute]) => [
          attributeName,
          jsonizeAttribute(attribute)
        ])
      )
    }
  }
}
