import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { map, number, string } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'

const schema = map({ str: string(), num: number() })
const zodSchema = z.object({ str: z.string(), num: z.number() })
const assertSchema: A.Equals<FormattedValueZodSchema<typeof schema>, typeof zodSchema> = 1
assertSchema
