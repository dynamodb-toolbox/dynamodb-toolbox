import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { expressPaths } from './expressPaths.js'
import { transformPaths } from './transformPaths.js'
import type { TransformPathsOptions } from './transformPaths.js'
import type { ProjectionExpression } from './types.js'

/**
 * Options accepted by the path parser.
 */
export interface ParsePathsOptions extends TransformPathsOptions {}

/**
 * Compiles attribute paths into a DynamoDB projection expression.
 */
export class PathParser<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'parsePath' as const
  /**
   * Render transformed paths into a projection expression.
   */
  static express(paths: string[]): ProjectionExpression {
    return expressPaths(paths)
  }

  /**
   * Map app-level paths to their saved attribute names.
   */
  transform(paths: string[], options?: TransformPathsOptions): string[] {
    return transformPaths(this.schema, paths, options)
  }

  /**
   * Compile attribute paths into a projection expression.
   */
  parse(paths: string[], options?: TransformPathsOptions): ProjectionExpression {
    return PathParser.express(this.transform(paths, options))
  }
}
