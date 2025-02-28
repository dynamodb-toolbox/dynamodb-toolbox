import type { Schema } from '~/schema/index.js'

export class SchemaAction<SCHEMA extends Schema = Schema> {
  constructor(public schema: SCHEMA) {}
}
