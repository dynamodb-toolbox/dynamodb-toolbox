import { z } from 'zod'

import type { BooleanSchema } from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedBooleanZodSchema<SCHEMA extends BooleanSchema> = AddOptional<
  SCHEMA,
  z.ZodBoolean
>

export const getFormattedBooleanZodSchema = (schema: BooleanSchema): z.ZodTypeAny =>
  addOptional(schema, z.boolean())
