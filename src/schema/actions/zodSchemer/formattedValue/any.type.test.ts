import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { any } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const schema = any()
const zodSchema = z.any()
const assertSchema: A.Equals<FormattedValueZodSchema<typeof schema>, typeof zodSchema> = 1
assertSchema
