import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { itemZodFormatter, schemaZodFormatter } from './formatter/index.js'
import type { ZodFormatter, ZodFormatterOptions } from './formatter/index.js'

export class ZodSchemer<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'zodSchemer' as const

  formatter<OPTIONS extends ZodFormatterOptions = {}>(
    options: OPTIONS = {} as OPTIONS
  ): ZodFormatter<SCHEMA, OPTIONS> {
    if (this.schema.type === 'item') {
      return itemZodFormatter(this.schema, options) as ZodFormatter<SCHEMA, OPTIONS>
    } else {
      return schemaZodFormatter(this.schema, options) as ZodFormatter<SCHEMA, OPTIONS>
    }
  }
}
