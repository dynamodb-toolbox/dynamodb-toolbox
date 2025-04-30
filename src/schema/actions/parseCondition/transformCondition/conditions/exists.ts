import { Finder } from '~/schema/actions/finder/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
import type { Schema } from '~/schema/index.js'

import type { SchemaCondition } from '../../condition.js'
import { joinDedupedConditions } from './utils.js'

export const transformExistsCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { exists: unknown }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { exists } = condition
  const attributePath = condition.attr
  const subSchemas = schemaFinder.search(attributePath)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath
    conditions.push({ attr: path, exists })
  }

  return joinDedupedConditions(conditions, attributePath)
}
