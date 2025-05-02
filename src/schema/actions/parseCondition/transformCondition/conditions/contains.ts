import { Finder } from '~/schema/actions/finder/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
import type { Schema } from '~/schema/index.js'
import { StringSchema } from '~/schema/string/schema.js'

import { Parser } from '../../../parse/parser.js'
import type { SchemaCondition } from '../../condition.js'
import { getComparedSubSchemas, joinDedupedConditions } from './utils.js'

export const transformContainsCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { contains: unknown }>
): SchemaCondition => {
  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)

  const { contains: formattedContains, transform } = condition
  const attributePath = condition.attr
  const subSchemas = schemaFinder.search(attributePath)
  const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedContains, transform)

  for (const subSchema of subSchemas) {
    const path = subSchema.transformedPath.strPath

    if (comparedSubSchemas !== undefined) {
      for (const comparedSubSchema of comparedSubSchemas) {
        const contains = { attr: comparedSubSchema.transformedPath.strPath }
        conditions.push({ attr: path, contains })
      }
    } else {
      try {
        let valueSchema = subSchema.schema
        switch (subSchema.schema.type) {
          case 'set':
          case 'list':
            valueSchema = subSchema.schema.elements
            break
          case 'string':
            // We accept any string in case of contains
            valueSchema = new StringSchema({})
            break
          default:
        }

        const valueParser = new Parser(valueSchema)

        const contains = valueParser.parse(formattedContains, { fill: false, transform })
        conditions.push({ attr: path, contains } as SchemaCondition)
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  return joinDedupedConditions(conditions, attributePath)
}
