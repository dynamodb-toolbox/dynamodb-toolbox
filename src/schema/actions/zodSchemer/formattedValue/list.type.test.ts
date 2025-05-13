import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { list, string } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const schema = list(string())
const zodSchema = z.array(z.string())
const assertSchema: A.Equals<FormattedValueZodSchema<typeof schema>, typeof zodSchema> = 1
assertSchema
