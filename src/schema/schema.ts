import type { AttrSchema } from '~/attributes/index.js'

export class SchemaAction<SCHEMA extends AttrSchema = AttrSchema> {
  constructor(public schema: SCHEMA) {}
}
