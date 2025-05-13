import { z } from 'zod'

import type { BinarySchema } from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedBinaryZodSchema<SCHEMA extends BinarySchema> = AddOptional<
  SCHEMA,
  z.ZodType<Uint8Array>
>

export const getFormattedBinaryZodSchema = (schema: BinarySchema): z.ZodTypeAny =>
  addOptional(schema, z.instanceof(Uint8Array))
