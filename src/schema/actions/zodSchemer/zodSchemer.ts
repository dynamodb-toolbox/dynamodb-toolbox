import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { getZodFormatter } from './formattedValue/index.js'
import type { ZodFormatter } from './formattedValue/index.js'

export class ZodSchemer<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'zodSchemer' as const

  formatter(): ZodFormatter<SCHEMA> {
    return getZodFormatter(this.schema)
  }
}
