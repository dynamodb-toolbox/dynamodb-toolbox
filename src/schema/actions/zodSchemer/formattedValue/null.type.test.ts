import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { nul } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const schema = nul()
const zodFormatter = z.null()
const assert: A.Equals<ZodFormatter<typeof schema>, typeof zodFormatter> = 1
assert

const optSchema = schema.optional()
const optZodFormatter = zodFormatter.optional()
const assertOpt: A.Equals<ZodFormatter<typeof optSchema>, typeof optZodFormatter> = 1
assertOpt
