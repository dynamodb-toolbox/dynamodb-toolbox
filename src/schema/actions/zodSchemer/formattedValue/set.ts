import { z } from 'zod'

import type { SetSchema } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'
import { getFormattedValueZodSchema } from './schema.js'
import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedSetZodSchema<SCHEMA extends SetSchema> = AddOptional<
  SCHEMA,
  z.ZodSet<FormattedValueZodSchema<SCHEMA['elements']>>
>

export const getFormattedSetZodSchema = (schema: SetSchema): z.ZodTypeAny =>
  addOptional(schema, z.set(getFormattedValueZodSchema(schema.elements)))
