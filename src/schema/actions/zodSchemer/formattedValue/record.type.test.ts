import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { number, record, string } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const schema = record(string(), number())
const zodSchema = z.record(z.string(), z.number())
const assertSchema: A.Equals<FormattedValueZodSchema<typeof schema>, typeof zodSchema> = 1
assertSchema
