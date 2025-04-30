import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { expressPaths } from './expressPaths.js'
import { transformPaths } from './transformPaths.js'
import type { TransformPathsOptions } from './transformPaths.js'
import type { ProjectionExpression } from './types.js'

export interface ParsePathsOptions extends TransformPathsOptions {}

export class PathParser<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'parsePath' as const
  static express(paths: string[]): ProjectionExpression {
    return expressPaths(paths)
  }

  transform(paths: string[], options?: TransformPathsOptions): string[] {
    return transformPaths(this.schema, paths, options)
  }

  parse(paths: string[], options?: TransformPathsOptions): ProjectionExpression {
    return PathParser.express(this.transform(paths, options))
  }
}
