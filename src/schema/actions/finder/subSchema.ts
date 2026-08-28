import type { Path } from '~/schema/actions/utils/path.js'
import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

/**
 * A resolved sub-schema paired with its formatted and transformed paths.
 */
export class SubSchema<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  readonly formattedPath: Path
  readonly transformedPath: Path

  /**
   * Instantiate from a schema and its formatted/transformed paths.
   */
  constructor({
    schema,
    formattedPath,
    transformedPath
  }: {
    schema: SCHEMA
    formattedPath: Path
    transformedPath: Path
  }) {
    super(schema)
    this.formattedPath = formattedPath
    this.transformedPath = transformedPath
  }
}
