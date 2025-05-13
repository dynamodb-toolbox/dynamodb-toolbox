import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { anyOf, number, string } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const schema = anyOf(string(), number())
const zodSchema = z.union([z.string(), z.number()])
const assertSchema: A.Equals<FormattedValueZodSchema<typeof schema>, typeof zodSchema> = 1
assertSchema
