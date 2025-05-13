import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { list, string } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const schema = list(string())
const zodSchema = z.array(z.string())
const assertSchema: A.Equals<FormattedValueZodSchema<typeof schema>, typeof zodSchema> = 1
assertSchema

const optSchema = list(string()).optional()
const optZodSchema = z.array(z.string()).optional()
const assertOptSchema: A.Equals<FormattedValueZodSchema<typeof optSchema>, typeof optZodSchema> = 1
assertOptSchema
