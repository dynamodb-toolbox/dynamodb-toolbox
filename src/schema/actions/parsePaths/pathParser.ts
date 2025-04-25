import { DynamoDBToolboxError } from '~/errors/index.js'
import { Finder } from '~/schema/actions/finder/index.js'
import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import type { ProjectionExpression } from './projectionExpression.js'
import { Projection } from './projectionExpression.js'

export interface ProjectOptions {
  strict?: boolean
}

export interface ParseOptions extends ProjectOptions {
  expressionId?: string
}

export class PathParser<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  static override actionName = 'parsePath' as const

  project(paths: string[], { strict = true }: { strict?: boolean } = {}): Projection {
    const projection = new Projection()

    for (const attributePath of paths) {
      const subSchemas = new Finder(this.schema).search(attributePath)

      if (subSchemas.length === 0 && strict) {
        throw new DynamoDBToolboxError('actions.invalidExpressionAttributePath', {
          message: `Unable to match expression attribute path with schema: ${attributePath}`,
          payload: { attributePath }
        })
      }

      for (const subSchema of subSchemas) {
        projection.addPath(subSchema.transformedPath)
      }
    }

    return projection
  }

  parse(
    paths: string[],
    { expressionId, ...parseOptions }: ParseOptions = {}
  ): ProjectionExpression {
    return this.project(paths, parseOptions).express(expressionId)
  }
}
