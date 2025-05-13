import { z } from 'zod'

import type { SetSchema } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'
import { getFormattedValueZodSchema } from './schema.js'

export type FormattedSetZodSchema<SCHEMA extends SetSchema> = z.ZodSet<
  FormattedValueZodSchema<SCHEMA['elements']>
>

export const getFormattedSetZodSchema = (schema: SetSchema): z.ZodTypeAny =>
  z.set(getFormattedValueZodSchema(schema.elements))
