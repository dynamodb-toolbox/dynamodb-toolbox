import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { number } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const numSchema = number()
const numZodSchema = z.number()
const assertNumSchema: A.Equals<FormattedValueZodSchema<typeof numSchema>, typeof numZodSchema> = 1
assertNumSchema

const optNumSchema = numSchema.optional()
const optZodNumSchema = numZodSchema.optional()
const assertOptNumSchema: A.Equals<
  FormattedValueZodSchema<typeof optNumSchema>,
  typeof optZodNumSchema
> = 1
assertOptNumSchema
