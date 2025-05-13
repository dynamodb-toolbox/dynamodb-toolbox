import { z } from 'zod'

import type { SetSchema } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'
import { getZodFormatter } from './schema.js'
import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type SetZodFormatter<SCHEMA extends SetSchema> = AddOptional<
  SCHEMA,
  z.ZodSet<ZodFormatter<SCHEMA['elements']>>
>

export const getSetZodFormatter = (schema: SetSchema): z.ZodTypeAny =>
  addOptional(schema, z.set(getZodFormatter(schema.elements)))
