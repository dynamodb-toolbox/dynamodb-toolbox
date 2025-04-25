import type { Path } from '~/schema/actions/utils/path.js'
import type { Schema } from '~/schema/index.js'

export class SubSchema {
  public schema: Schema
  public originalPath: Path
  public transformedPath: Path

  constructor({
    schema,
    originalPath,
    transformedPath
  }: {
    schema: Schema
    originalPath: Path
    transformedPath: Path
  }) {
    this.schema = schema
    this.originalPath = originalPath
    this.transformedPath = transformedPath
  }
}
