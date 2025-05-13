import { z } from 'zod'

import type { NullSchema } from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedNullZodSchema<SCHEMA extends NullSchema> = AddOptional<SCHEMA, z.ZodNull>

export const getFormattedNullZodSchema = (schema: NullSchema): z.ZodTypeAny =>
  addOptional(schema, z.null())
