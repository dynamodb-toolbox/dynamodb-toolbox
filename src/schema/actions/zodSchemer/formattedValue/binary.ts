import { z } from 'zod'

import type { BinarySchema } from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type BinaryZodFormatter<SCHEMA extends BinarySchema> = AddOptional<
  SCHEMA,
  z.ZodType<Uint8Array>
>

export const getBinaryZodFormatter = (schema: BinarySchema): z.ZodTypeAny =>
  addOptional(schema, z.instanceof(Uint8Array))
