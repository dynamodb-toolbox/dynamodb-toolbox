import { z } from 'zod'

import type { NullSchema } from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type NullZodFormatter<SCHEMA extends NullSchema> = AddOptional<SCHEMA, z.ZodNull>

export const getNullZodFormatter = (schema: NullSchema): z.ZodTypeAny =>
  addOptional(schema, z.null())
