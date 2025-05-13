import { z } from 'zod'

import type { AnySchema } from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type AnyZodFormatter<SCHEMA extends AnySchema> = AddOptional<
  SCHEMA,
  z.ZodType<SCHEMA['props']['castAs']>
>

export const getAnyZodFormatter = (schema: AnySchema): z.ZodTypeAny =>
  addOptional(schema, z.custom())
