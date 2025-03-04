import type { Schema } from '~/schema/index.js'

export class SchemaAction<SCHEMA extends Schema = Schema> {
  static actionName: string

  constructor(public schema: SCHEMA) {}
}
