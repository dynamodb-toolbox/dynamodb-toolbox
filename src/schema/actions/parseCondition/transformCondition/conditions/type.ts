import { Finder } from '~/schema/actions/finder/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
import type { Schema } from '~/schema/index.js'
import { StringSchema } from '~/schema/string/schema.js'

import type { ConditionType, SchemaCondition } from '../../condition.js'
import { joinDedupedConditions } from './utils.js'

const typeSchema = new StringSchema({
  enum: ['S', 'SS', 'N', 'NS', 'B', 'BS', 'BOOL', 'NULL', 'L', 'M'] as ConditionType[]
})
const typeParser = new Parser(typeSchema)

export const transformTypeCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { type: unknown; value?: never }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { type: formattedType } = condition
  const attributePath = condition.attr
  const subSchemas = schemaFinder.search(attributePath)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath
    const type = typeParser.parse(formattedType, { fill: false, transform: false })
    conditions.push({ attr: path, type })
  }

  return joinDedupedConditions(conditions, attributePath)
}
