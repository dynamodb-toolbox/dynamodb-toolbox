import { Finder } from '~/schema/actions/finder/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
import type { Schema } from '~/schema/index.js'

import { Parser } from '../../../parse/parser.js'
import type { SchemaCondition } from '../../condition.js'
import { getComparedSubSchemas, joinDedupedConditions } from './utils.js'

export const transformBeginsWithCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { beginsWith: unknown; value?: never }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { beginsWith: formattedBeginsWith, transform } = condition
  const attributePath = condition.attr
  const subSchemas = schemaFinder.search(attributePath)
  const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedBeginsWith, transform)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath

    if (comparedSubSchemas !== undefined) {
      for (const comparedSubSchema of comparedSubSchemas) {
        const beginsWith = { attr: comparedSubSchema.transformedPath.strPath }
        conditions.push({ attr: path, beginsWith })
      }
    } else {
      const valueSchema = subSchema.schema
      const valueParser = new Parser(valueSchema)

      try {
        const beginsWith = valueParser.parse(formattedBeginsWith, { fill: false, transform })
        conditions.push({ attr: path, beginsWith } as SchemaCondition)
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  return joinDedupedConditions(conditions, attributePath)
}
