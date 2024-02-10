import type { Schema } from './schema'
import type { Attribute } from './attributes'

export class SchemaAction<SCHEMA extends Schema | Attribute = Schema | Attribute> {
  schema: SCHEMA

  constructor(schema: SCHEMA) {
    this.schema = schema
  }
}
