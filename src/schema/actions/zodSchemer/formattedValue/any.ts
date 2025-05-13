import { z } from 'zod'

import type { AnySchema } from '~/schema/index.js'

export type FormattedAnyZodSchema<SCHEMA extends AnySchema> = z.ZodAny

export const getFormattedAnyZodSchema = (schema: AnySchema): z.ZodTypeAny => z.any()
