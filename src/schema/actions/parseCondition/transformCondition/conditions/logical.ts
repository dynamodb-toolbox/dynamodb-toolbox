import type { Schema } from '~/schema/index.js'

import type { SchemaCondition } from '../../condition.js'
import { transformCondition } from '../transformCondition.js'

export const transformOrCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { or: unknown }>
): SchemaCondition => ({ or: condition.or.map(cond => transformCondition(schema, cond)) })

export const transformAndCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { and: unknown }>
): SchemaCondition => ({ and: condition.and.map(cond => transformCondition(schema, cond)) })

export const transformNotCondition = (
  schema: Schema,
  condition: Extract<SchemaCondition, { not: unknown }>
): SchemaCondition => ({ not: transformCondition(schema, condition.not) })
