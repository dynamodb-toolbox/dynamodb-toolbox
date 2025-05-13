import type { A } from 'ts-toolbelt'
import { z } from 'zod'

import { anyOf, map, number, string } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'

const schema = anyOf(string(), number())
const zodFormatter = z.union([z.string(), z.number()])
const assert: A.Equals<ZodFormatter<typeof schema>, typeof zodFormatter> = 1
assert

const optSchema = schema.optional()
const optZodFormatter = zodFormatter.optional()
const assertOpt: A.Equals<ZodFormatter<typeof optSchema>, typeof optZodFormatter> = 1
assertOpt

const discrSchema = anyOf(
  map({ type: string().const('a') }),
  map({ type: string().enum('b', 'c') })
).discriminate('type')
const discrZodFormatter = z.discriminatedUnion('type', [
  z.object({ type: z.literal('a') }),
  z.object({ type: z.enum(['b', 'c']) })
])
const assertDiscrSchema: A.Equals<ZodFormatter<typeof discrSchema>, typeof discrZodFormatter> = 1
assertDiscrSchema
