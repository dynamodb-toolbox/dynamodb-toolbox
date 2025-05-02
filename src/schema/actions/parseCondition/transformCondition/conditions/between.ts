import { Finder } from '~/schema/actions/finder/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
import type { Schema } from '~/schema/index.js'
import { NumberSchema } from '~/schema/number/schema.js'

import { Parser } from '../../../parse/parser.js'
import type { SchemaCondition } from '../../condition.js'
import { getComparedSubSchemas, joinDedupedConditions } from './utils.js'

export const transformBetweenCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { between: unknown }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { between: formattedBetween } = condition
  const size = 'size' in condition
  const attributePath = size ? condition.size : condition.attr
  const transform = size ? undefined : condition.transform
  const subSchemas = schemaFinder.search(attributePath)

  const [formattedLeft, formattedRight] = formattedBetween
  const comparedLeftSubSchemas = getComparedSubSchemas(schemaFinder, formattedLeft, transform)
  const comparedRightSubSchemas = getComparedSubSchemas(schemaFinder, formattedRight, transform)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath
    const valueSchema = size ? new NumberSchema({}) : subSchema.schema
    const valueParser = new Parser(valueSchema)

    const betweens = new Deduper<unknown[]>()

    if (comparedLeftSubSchemas !== undefined) {
      for (const comparedLeftSubSchema of comparedLeftSubSchemas) {
        const left = { attr: comparedLeftSubSchema.transformedPath.strPath }

        if (comparedRightSubSchemas !== undefined) {
          for (const comparedRightSubSchema of comparedRightSubSchemas) {
            const right = { attr: comparedRightSubSchema.transformedPath.strPath }
            betweens.push([left, right])
          }
        } else {
          try {
            const right = valueParser.parse(formattedRight, { fill: false, transform })
            betweens.push([left, right])
            // eslint-disable-next-line no-empty
          } catch {}
        }
      }
    } else {
      let left: unknown
      try {
        left = valueParser.parse(formattedLeft, { fill: false, transform })
      } catch {
        continue
      }

      if (comparedRightSubSchemas !== undefined) {
        for (const comparedRightSubSchema of comparedRightSubSchemas) {
          const right = { attr: comparedRightSubSchema.transformedPath.strPath }
          betweens.push([left, right])
        }
      } else {
        try {
          const right = valueParser.parse(formattedRight, { fill: false, transform })
          betweens.push([left, right])
          // eslint-disable-next-line no-empty
        } catch {}
      }
    }

    if (betweens.values.length === 0) {
      continue
    }

    for (const between of betweens.values) {
      conditions.push((size ? { size: path, between } : { attr: path, between }) as SchemaCondition)
    }
  }

  return joinDedupedConditions(conditions, attributePath)
}
