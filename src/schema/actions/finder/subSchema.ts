import type { Path } from '~/schema/actions/utils/path.js'
import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

export class SubSchema<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  public formattedPath: Path
  public transformedPath: Path

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
