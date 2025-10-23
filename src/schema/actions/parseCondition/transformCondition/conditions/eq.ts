import { Finder } from '~/schema/actions/finder/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
import type { Schema } from '~/schema/index.js'
import { NumberSchema } from '~/schema/number/schema.js'

import { Parser } from '../../../parse/parser.js'
import type { SchemaCondition } from '../../condition.js'
import { getComparedSubSchemas, joinDedupedConditions } from './utils.js'

export const transformEqCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { eq: unknown; value?: never }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { eq: formattedEq } = condition
  const size = 'size' in condition
  const attributePath = size ? condition.size : condition.attr
  const transform = size ? undefined : condition.transform
  const subSchemas = schemaFinder.search(attributePath)
  const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedEq, transform)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath

    if (comparedSubSchemas !== undefined) {
      for (const comparedSubSchema of comparedSubSchemas) {
        const eq = { attr: comparedSubSchema.transformedPath.strPath }
        conditions.push(size ? { size: path, eq } : { attr: path, eq })
      }
    } else {
      const valueSchema = size ? new NumberSchema({}) : subSchema.schema
      const valueParser = new Parser(valueSchema)

      try {
        const eq = valueParser.parse(formattedEq, { fill: false, transform })
        conditions.push((size ? { size: path, eq } : { attr: path, eq }) as SchemaCondition)
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  return joinDedupedConditions(conditions, attributePath)
}

export const transformNeCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { ne: unknown; value?: never }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { ne: formattedNe } = condition
  const size = 'size' in condition
  const attributePath = size ? condition.size : condition.attr
  const transform = size ? undefined : condition.transform
  const subSchemas = schemaFinder.search(attributePath)
  const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedNe, transform)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath

    if (comparedSubSchemas !== undefined) {
      for (const comparedSubSchema of comparedSubSchemas) {
        const ne = { attr: comparedSubSchema.transformedPath.strPath }
        conditions.push(size ? { size: path, ne } : { attr: path, ne })
      }
    } else {
      const valueSchema = size ? new NumberSchema({}) : subSchema.schema
      const valueParser = new Parser(valueSchema)

      try {
        const ne = valueParser.parse(formattedNe, { fill: false, transform })
        conditions.push((size ? { size: path, ne } : { attr: path, ne }) as SchemaCondition)
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  return joinDedupedConditions(conditions, attributePath)
}
