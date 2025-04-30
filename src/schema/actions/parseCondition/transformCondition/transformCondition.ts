import { DynamoDBToolboxError } from '~/errors/index.js'
import { Finder } from '~/schema/actions/finder/index.js'
import { Deduper } from '~/schema/actions/utils/deduper.js'
import type { Schema } from '~/schema/index.js'
import { NumberSchema } from '~/schema/number/schema.js'
import { StringSchema } from '~/schema/string/schema.js'

import { Parser } from '../../parse/parser.js'
import type { SchemaCondition } from '../condition.js'
import { attributeType, getComparedSubSchemas } from './utils.js'

export const transformCondition = (schema: Schema, condition: SchemaCondition): SchemaCondition => {
  if ('or' in condition) {
    return { or: condition.or.map(cond => transformCondition(schema, cond)) }
  }

  if ('and' in condition) {
    return { and: condition.and.map(cond => transformCondition(schema, cond)) }
  }

  if ('not' in condition) {
    return { not: transformCondition(schema, condition.not) }
  }

  const conditions = new Deduper<SchemaCondition>()
  const schemaFinder = new Finder(schema)
  let attributePath: string

  switch (true) {
    case 'eq' in condition: {
      const { eq: formattedEq } = condition
      const size = 'size' in condition
      attributePath = size ? condition.size : condition.attr
      const transform = size ? undefined : condition.transform
      const subSchemas = schemaFinder.search(attributePath)
      const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedEq)

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
      break
    }
    case 'ne' in condition: {
      const { ne: formattedNe } = condition
      const size = 'size' in condition
      attributePath = size ? condition.size : condition.attr
      const transform = size ? undefined : condition.transform
      const subSchemas = schemaFinder.search(attributePath)
      const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedNe)

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
      break
    }
    case 'gte' in condition: {
      const { gte: formattedGte } = condition
      const size = 'size' in condition
      attributePath = size ? condition.size : condition.attr
      const transform = size ? undefined : condition.transform
      const subSchemas = schemaFinder.search(attributePath)
      const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedGte)

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
      break
    }
    case 'gt' in condition: {
      const { gt: formattedGt } = condition
      const size = 'size' in condition
      attributePath = size ? condition.size : condition.attr
      const transform = size ? undefined : condition.transform
      const subSchemas = schemaFinder.search(attributePath)
      const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedGt)

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
      break
    }
    case 'lte' in condition: {
      const { lte: formattedLte } = condition
      const size = 'size' in condition
      attributePath = size ? condition.size : condition.attr
      const transform = size ? undefined : condition.transform
      const subSchemas = schemaFinder.search(attributePath)
      const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedLte)

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
      break
    }
    case 'lt' in condition: {
      const { lt: formattedLt } = condition
      const size = 'size' in condition
      attributePath = size ? condition.size : condition.attr
      const transform = size ? undefined : condition.transform
      const subSchemas = schemaFinder.search(attributePath)
      const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedLt)

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
      break
    }
    case 'between' in condition: {
      const { between: formattedBetween } = condition
      const size = 'size' in condition
      attributePath = size ? condition.size : condition.attr
      const transform = size ? undefined : condition.transform
      const subSchemas = schemaFinder.search(attributePath)

      const [formattedLeft, formattedRight] = formattedBetween
      const comparedLeftSubSchemas = getComparedSubSchemas(schemaFinder, formattedLeft)
      const comparedRightSubSchemas = getComparedSubSchemas(schemaFinder, formattedRight)

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
          conditions.push(
            (size ? { size: path, between } : { attr: path, between }) as SchemaCondition
          )
        }
      }
      break
    }
    case 'beginsWith' in condition: {
      const { beginsWith: formattedBeginsWith, transform } = condition
      attributePath = condition.attr
      const subSchemas = schemaFinder.search(attributePath)
      const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedBeginsWith)

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
      break
    }
    case 'in' in condition: {
      const { in: formattedIns } = condition
      const size = 'size' in condition
      attributePath = size ? condition.size : condition.attr
      const transform = size ? undefined : condition.transform
      const subSchemas = schemaFinder.search(attributePath)

      for (const subSchema of subSchemas) {
        const path = subSchema.transformedPath.strPath
        const valueSchema = size ? new NumberSchema({}) : subSchema.schema
        const valueParser = new Parser(valueSchema)

        // Wrap value in object to avoid mixing str/number types
        const _in = new Deduper({ serializer: value => JSON.stringify({ _: value }) })

        for (const formattedRangeValue of formattedIns) {
          const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedRangeValue)

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
      break
    }
    case 'contains' in condition: {
      const { contains: formattedContains, transform } = condition
      attributePath = condition.attr
      const subSchemas = schemaFinder.search(attributePath)
      const comparedSubSchemas = getComparedSubSchemas(schemaFinder, formattedContains)

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
      break
    }
    case 'exists' in condition: {
      const { exists } = condition
      attributePath = condition.attr
      const subSchemas = schemaFinder.search(attributePath)

      for (const subSchema of subSchemas) {
        const path = subSchema.transformedPath.strPath
        conditions.push({ attr: path, exists })
      }
      break
    }
    case 'type' in condition: {
      const { type: formattedType } = condition
      attributePath = condition.attr
      const subSchemas = schemaFinder.search(attributePath)

      const valueSchema = new StringSchema({ enum: attributeType })
      const valueParser = new Parser(valueSchema)

      for (const subSchema of subSchemas) {
        const path = subSchema.transformedPath.strPath
        const type = valueParser.parse(formattedType, { fill: false, transform: false })
        conditions.push({ attr: path, type })
      }
      break
    }
    default:
      throw new DynamoDBToolboxError('actions.invalidCondition', {
        message: 'Invalid condition: Unable to detect valid condition type.'
      })
  }

  const [conditionsHead, ...conditionsTail] = conditions.values
  if (conditionsHead === undefined) {
    throw new DynamoDBToolboxError('actions.invalidExpressionAttributePath', {
      message: `Unable to match expression attribute path with schema: ${attributePath}`,
      payload: { attributePath }
    })
  }

  return conditionsTail.length > 0 ? { or: [conditionsHead, ...conditionsTail] } : conditionsHead
}
