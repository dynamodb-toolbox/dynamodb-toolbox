import type { Schema } from '~/schema/index.js'

/**
 * Base class shared by all schema actions.
 */
export class SchemaAction<SCHEMA extends Schema = Schema> {
  static actionName: string

  /**
   * Bind the action to a schema.
   */
  constructor(readonly schema: SCHEMA) {}
}
