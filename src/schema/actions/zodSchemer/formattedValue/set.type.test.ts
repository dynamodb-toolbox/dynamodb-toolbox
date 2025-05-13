import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { set, string } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const schema = set(string())
const zodSchema = z.set(z.string())
const assertSchema: A.Equals<FormattedValueZodSchema<typeof schema>, typeof zodSchema> = 1
assertSchema
