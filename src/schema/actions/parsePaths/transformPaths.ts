import { DynamoDBToolboxError } from '~/errors/index.js'
import { Finder } from '~/schema/actions/finder/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
import type { Schema } from '~/schema/index.js'

/**
 * Options accepted when transforming paths.
 */
export interface TransformPathsOptions {
  strict?: boolean
}

/**
 * Map app-level paths to their saved attribute names.
 */
export const transformPaths = (
  schema: Schema,
  paths: string[],
  { strict = true }: TransformPathsOptions = {}
): string[] => {
  const transformedPaths = new Deduper<string>({ serializer: value => value })
  const finder = new Finder(schema)

  for (const attributePath of paths) {
    const subSchemas = finder.search(attributePath)

    if (subSchemas.length === 0 && strict) {
      throw new DynamoDBToolboxError('actions.invalidExpressionAttributePath', {
        message: `Unable to match expression attribute path with schema: ${attributePath}`,
        payload: { attributePath }
      })
    }

    for (const subSchema of subSchemas) {
      transformedPaths.push(subSchema.transformedPath.strPath)
    }
  }

  return transformedPaths.values
}
