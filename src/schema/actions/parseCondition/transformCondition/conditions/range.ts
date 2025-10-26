import { Finder } from '~/schema/actions/finder/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
import type { Schema } from '~/schema/index.js'
import { NumberSchema } from '~/schema/number/schema.js'

import { Parser } from '../../../parse/parser.js'
import type { SchemaCondition } from '../../condition.js'
import { getComparedSubSchemas, joinDedupedConditions } from './utils.js'

export const transformGteCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { gte: unknown; value?: never }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { gte: formattedGte } = condition
  const size = 'size' in condition
  const attributePath = size ? condition.size : condition.attr
  const transform = size ? undefined : condition.transform
  const subSchemas = schemaFinder.search(attributePath)
  const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedGte, transform)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath

    if (comparedSubSchemas !== undefined) {
      for (const comparedSubSchema of comparedSubSchemas) {
        const gte = { attr: comparedSubSchema.transformedPath.strPath }
        conditions.push(size ? { size: path, gte } : { attr: path, gte })
      }
    } else {
      const valueSchema = size ? new NumberSchema({}) : subSchema.schema
      const valueParser = new Parser(valueSchema)

      try {
        const gte = valueParser.parse(formattedGte, { fill: false, transform })
        conditions.push((size ? { size: path, gte } : { attr: path, gte }) as SchemaCondition)
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  return joinDedupedConditions(conditions, attributePath)
}

export const transformGtCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { gt: unknown; value?: never }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { gt: formattedGt } = condition
  const size = 'size' in condition
  const attributePath = size ? condition.size : condition.attr
  const transform = size ? undefined : condition.transform
  const subSchemas = schemaFinder.search(attributePath)
  const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedGt, transform)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath

    if (comparedSubSchemas !== undefined) {
      for (const comparedSubSchema of comparedSubSchemas) {
        const gt = { attr: comparedSubSchema.transformedPath.strPath }
        conditions.push(size ? { size: path, gt } : { attr: path, gt })
      }
    } else {
      const valueSchema = size ? new NumberSchema({}) : subSchema.schema
      const valueParser = new Parser(valueSchema)

      try {
        const gt = valueParser.parse(formattedGt, { fill: false, transform })
        conditions.push((size ? { size: path, gt } : { attr: path, gt }) as SchemaCondition)
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  return joinDedupedConditions(conditions, attributePath)
}

export const transformLteCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { lte: unknown; value?: never }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { lte: formattedLte } = condition
  const size = 'size' in condition
  const attributePath = size ? condition.size : condition.attr
  const transform = size ? undefined : condition.transform
  const subSchemas = schemaFinder.search(attributePath)
  const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedLte, transform)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath

    if (comparedSubSchemas !== undefined) {
      for (const comparedSubSchema of comparedSubSchemas) {
        const lte = { attr: comparedSubSchema.transformedPath.strPath }
        conditions.push(size ? { size: path, lte } : { attr: path, lte })
      }
    } else {
      const valueSchema = size ? new NumberSchema({}) : subSchema.schema
      const valueParser = new Parser(valueSchema)

      try {
        const lte = valueParser.parse(formattedLte, { fill: false, transform })
        conditions.push((size ? { size: path, lte } : { attr: path, lte }) as SchemaCondition)
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  return joinDedupedConditions(conditions, attributePath)
}

export const transformLtCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { lt: unknown; value?: never }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { lt: formattedLt } = condition
  const size = 'size' in condition
  const attributePath = size ? condition.size : condition.attr
  const transform = size ? undefined : condition.transform
  const subSchemas = schemaFinder.search(attributePath)
  const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedLt, transform)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath

    if (comparedSubSchemas !== undefined) {
      for (const comparedSubSchema of comparedSubSchemas) {
        const lt = { attr: comparedSubSchema.transformedPath.strPath }
        conditions.push(size ? { size: path, lt } : { attr: path, lt })
      }
    } else {
      const valueSchema = size ? new NumberSchema({}) : subSchema.schema
      const valueParser = new Parser(valueSchema)

      try {
        const lt = valueParser.parse(formattedLt, { fill: false, transform })
        conditions.push((size ? { size: path, lt } : { attr: path, lt }) as SchemaCondition)
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  return joinDedupedConditions(conditions, attributePath)
}
