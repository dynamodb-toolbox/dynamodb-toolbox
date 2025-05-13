import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { map, number, string } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const schema = map({ str: string(), num: number(), hidden: string().hidden() })
const zodFormatter = z.object({ str: z.string(), num: z.number() })
const assert: A.Equals<ZodFormatter<typeof schema>, typeof zodFormatter> = 1
assert

const optSchema = schema.optional()
const optZodFormatter = zodFormatter.optional()
const assertOpt: A.Equals<ZodFormatter<typeof optSchema>, typeof optZodFormatter> = 1
assertOpt
