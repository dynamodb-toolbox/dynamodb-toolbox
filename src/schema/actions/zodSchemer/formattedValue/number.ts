import { z } from 'zod'

import type { NumberSchema } from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedNumberZodSchema<SCHEMA extends NumberSchema> = AddOptional<SCHEMA, z.ZodNumber>

export const getFormattedNumberZodSchema = (schema: NumberSchema): z.ZodTypeAny =>
  addOptional(schema, z.number())
