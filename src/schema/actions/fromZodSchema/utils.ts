import type { ZodType } from 'zod'

import type { Schema, Schema_ } from '~/schema/types/schema.js'

export const withMeta = <SCHEMA extends Schema>(
  schema: SCHEMA,
  { description }: ZodType
): SCHEMA =>
  description !== undefined
    ? ((schema as Schema_).meta({ description }) as unknown as SCHEMA)
    : schema
