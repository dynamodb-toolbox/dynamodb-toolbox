import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { set, string } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const schema = set(string())
const zodFormatter = z.set(z.string())
const assert: A.Equals<ZodFormatter<typeof schema>, typeof zodFormatter> = 1
assert

const optSchema = schema.optional()
const optZodFormatter = zodFormatter.optional()
const assertOpt: A.Equals<ZodFormatter<typeof optSchema>, typeof optZodFormatter> = 1
assertOpt
