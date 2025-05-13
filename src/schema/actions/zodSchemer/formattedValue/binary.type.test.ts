import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { binary } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const binSchema = binary()
const binZodSchema = z.instanceof(Uint8Array)
const assertBinSchema: A.Equals<FormattedValueZodSchema<typeof binSchema>, typeof binZodSchema> = 1
assertBinSchema

const optBinSchema = binSchema.optional()
const optZodBinSchema = binZodSchema.optional()
const assertOptBinSchema: A.Equals<
  FormattedValueZodSchema<typeof optBinSchema>,
  typeof optZodBinSchema
> = 1
assertOptBinSchema
