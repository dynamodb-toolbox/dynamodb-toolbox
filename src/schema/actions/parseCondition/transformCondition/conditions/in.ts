import { Finder } from '~/schema/actions/finder/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
import type { Schema } from '~/schema/index.js'
import { NumberSchema } from '~/schema/number/schema.js'

import { Parser } from '../../../parse/parser.js'
import type { SchemaCondition } from '../../condition.js'
import { getComparedSubSchemas, joinDedupedConditions } from './utils.js'

export const transformInCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { in: unknown }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { in: formattedIns } = condition
  const size = 'size' in condition
  const attributePath = size ? condition.size : condition.attr
  const transform = size ? undefined : condition.transform
  const subSchemas = schemaFinder.search(attributePath)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath
    const valueSchema = size ? new NumberSchema({}) : subSchema.schema
    const valueParser = new Parser(valueSchema)

    // Wrap value in object to avoid mixing str/number types
    const _in = new Deduper({ serializer: value => JSON.stringify({ _: value }) })

    for (const formattedRangeValue of formattedIns) {
      const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedRangeValue, transform)

      if (comparedSubSchemas !== undefined) {
        for (const comparedSubSchema of comparedSubSchemas) {
          _in.push({ attr: comparedSubSchema.transformedPath.strPath })
        }
      } else {
        try {
          _in.push(valueParser.parse(formattedRangeValue, { fill: false, transform }))
          // eslint-disable-next-line no-empty
        } catch {}
      }
    }

    const inValues = _in.values
    if (inValues.length === 0) {
      continue
    }

    conditions.push(
      (size ? { size: path, in: inValues } : { attr: path, in: inValues }) as SchemaCondition
    )
  }

  return joinDedupedConditions(conditions, attributePath)
}
