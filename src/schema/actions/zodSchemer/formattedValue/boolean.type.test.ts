import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { boolean } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const boolSchema = boolean()
const boolZodSchema = z.boolean()
const assertBoolSchema: A.Equals<
  FormattedValueZodSchema<typeof boolSchema>,
  typeof boolZodSchema
> = 1
assertBoolSchema

const optBoolSchema = boolSchema.optional()
const optZodBoolSchema = boolZodSchema.optional()
const assertOptBoolSchema: A.Equals<
  FormattedValueZodSchema<typeof optBoolSchema>,
  typeof optZodBoolSchema
> = 1
assertOptBoolSchema
