import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { nul } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const nulSchema = nul()
const nulZodSchema = z.null()
const assertNulSchema: A.Equals<FormattedValueZodSchema<typeof nulSchema>, typeof nulZodSchema> = 1
assertNulSchema

const optNulSchema = nulSchema.optional()
const optZodNulSchema = nulZodSchema.optional()
const assertOptNulSchema: A.Equals<
  FormattedValueZodSchema<typeof optNulSchema>,
  typeof optZodNulSchema
> = 1
assertOptNulSchema
