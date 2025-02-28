import type { Schema } from '~/attributes/index.js'

export class SchemaAction<SCHEMA extends Schema = Schema> {
  constructor(public schema: SCHEMA) {}
}
