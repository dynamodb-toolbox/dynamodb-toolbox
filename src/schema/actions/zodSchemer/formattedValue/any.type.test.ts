import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { any } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const schema = any()
const zodSchema = z.custom()
const assertSchema: A.Equals<FormattedValueZodSchema<typeof schema>, typeof zodSchema> = 1
assertSchema

const optSchema = schema.optional()
const optZodSchema = zodSchema.optional()
const assertOptSchema: A.Equals<FormattedValueZodSchema<typeof optSchema>, typeof optZodSchema> = 1
assertOptSchema

const castSchema = schema.castAs<string>()
const castZodSchema = z.custom<string>()
const assertCastSchema: A.Equals<
  FormattedValueZodSchema<typeof castSchema>,
  typeof castZodSchema
> = 1
assertCastSchema
